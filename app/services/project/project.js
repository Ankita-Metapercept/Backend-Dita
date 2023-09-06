const db = require("../../config/db");
const Organization = db.organization;
const Admin = db.orgAdmin;
const GitAuthToken = db.githubAuthToken;
const Project = db.project;
const ProjectUser = db.projectUser;
const axios = require("axios");
const _ = require("lodash");
module.exports = {
  addProject,
  updateProject,
  getProjectByOrgId,
  getProjectById,
  getProjectByUserId,
  syncProject,
  getProjectByGitUserId,
  getOutputTree,
  getGithubTree,
  getProjectByOrgIdAdminId,
  addAllAdminProject,
};
// add project inside organization
async function addProject(projectParam) {
  const project = new Project(projectParam);
  await project.save();
}
// update project
async function updateProject(projectParam, id) {
  const filter = { _id: id };
  let update = projectParam;
  projectParam.updatedAt = Date.now();
  let doc = await Project.findOneAndUpdate(filter, update);
  doc = await Project.findOne(filter);
  return doc;
}
// get list of all project by orgID
async function getProjectByOrgId(orgId) {
  return await Project.find({ orgId: orgId });
}
// get list of all project by organiation Id and organization admin id
async function getProjectByOrgIdAdminId(orgId, orgAdminId) {
  return await Project.find({ orgId: orgId, orgAdminId: orgAdminId });
}
// get project details by id
async function getProjectById(id) {
  return await Project.find({ _id: id });
}
// sync project
async function syncProject(gitToken, orgId, orgAdminId) {
  try {
    const syncedProjects = [];
    const projectList = await Project.find({
      orgId: orgId,
      orgAdminId: orgAdminId,
    });
    const { data: repoList } = await axios({
      method: "get",
      url: `https://api.github.com/user/repos`,
      headers: {
        Authorization: "token " + gitToken,
      },
    });
    const repoIdList = {};
    for (const repoDetails of repoList) {
      repoIdList[repoDetails.id] = repoDetails;
      repoIdList[repoDetails.id].isSynced = false;
    }
    for (const projectDetails of projectList) {
      if (repoIdList[projectDetails.projectRepoId]) {
        const { data: collabData } = await axios({
          method: "get",
          url: `https://api.github.com/repos/${projectDetails.owner}/${projectDetails.projectName}/collaborators`,
          headers: {
            Authorization: "token " + gitToken,
          },
        });
        const updateCollaboratorCount = collabData.length - 1;
        if (updateCollaboratorCount - projectDetails.gitCollaboratorsCount) {
          // collaborators updated on github
          repoIdList[projectDetails.projectRepoId].gitCollaboratorsCount =
            updateCollaboratorCount;
        } else {
          // no changes in collaborators count and project already synced
          repoIdList[projectDetails.projectRepoId].isSynced = true;
        }
      } else {
        // project is deleted from github
        await Project.deleteOne({
          orgId: orgId,
          orgAdminId: orgAdminId,
          projectRepoId: projectDetails.projectRepoId,
        });
      }
    }
    for (const projectRepoId in repoIdList) {
      if (
        !repoIdList[projectRepoId].isSynced &&
        repoIdList[projectRepoId].gitCollaboratorsCount
      ) {
        const updatedProject = await Project.findOneAndUpdate(
          { orgId: orgId, orgAdminId: orgAdminId, projectRepoId },
          {
            gitCollaboratorsCount:
              repoIdList[projectRepoId].gitCollaboratorsCount,
          }
        );
        syncedProjects.push(updatedProject);
      } else if (
        !repoIdList[projectRepoId].isSynced &&
        !repoIdList[projectRepoId].gitCollaboratorsCount
      ) {
        // new project added on client admin github
        const { data: collabData } = await axios({
          method: "get",
          url: `https://api.github.com/repos/${repoIdList[projectRepoId].owner.login}/${repoIdList[projectRepoId].name}/collaborators`,
          headers: {
            Authorization: "token " + gitToken,
          },
        });
        const projectParam = {
          projectName: repoIdList[projectRepoId].name,
          projectNodeId: repoIdList[projectRepoId].node_id,
          projectRepoId: repoIdList[projectRepoId].id,
          gitCloneUrl: repoIdList[projectRepoId].clone_url,
          owner: repoIdList[projectRepoId].owner.login,
          orgAdminId,
          gitCollaboratorsCount: collabData.length - 1,
          orgId,
          isDeleted: false,
          isFork: repoIdList[projectRepoId].fork,
          defaultBranch: repoIdList[projectRepoId].default_branch,
        };
        const project = new Project(projectParam);
        await project.save();
        syncedProjects.push(projectParam);
      }
    }
    return syncedProjects;
  } catch (error) {
    throw error;
  }
}
// get project by userId
async function getProjectByUserId(userId) {
  try {
    let res = await ProjectUser.find({ userId: userId });
    let projectData = await Project.find();
    let userProjects = [];
    res.forEach(async (element) => {
      let projectArr = _.filter(projectData, (e) => {
        return e.id === element.projectId;
      });
      if (projectArr.length !== 0) {
        projectArr.forEach((pdata) => {
          userProjects.push(pdata);
        });
      }
    });
    return await userProjects;
  } catch (err) {
    return err;
  }
}
// get project by git userId
async function getProjectByGitUserId(gitToken, githubUserId) {
  try {
    let repoList = await axios({
      method: "get",
      url: `https://api.github.com/user/repos`,
      headers: {
        Authorization: "token " + gitToken,
      },
    });
    let projectData = [];
    await repolistfun(repoList.data, gitToken, githubUserId).then(
      async (res) => {
        projectData = res;
      }
    );
    return projectData;
  } catch (err) {
    return err;
  }
}
async function repolistfun(repolist, gitToken, githubUserId) {
  let collabArr = [];
  for await (const element of repolist) {
    await collaboratordatafun(element.owner.login, element.name, gitToken).then(
      async (res) => {
        for await (const ele of res) {
          if (ele.id == githubUserId) {
            collabArr.push(element);
          }
        }
      }
    );
  }
  return collabArr;
}
async function collaboratordatafun(owner, repo, gitToken) {
  let collabData = await axios({
    method: "get",
    url: `https://api.github.com/repos/${owner}/${repo}/collaborators`,
    headers: {
      Authorization: "token " + gitToken,
    },
  });
  return collabData.data;
}
// Get output folder tree object
async function getOutputTree(gitToken, repouser, reponame, branchsha) {
  let treeData = await axios({
    method: "get",
    url: `https://api.github.com/repos/${repouser}/${reponame}/git/trees/${branchsha}?recursive=true`,
    headers: {
      Authorization: "token " + gitToken,
    },
  });
  let keyArr = [];
  for await (const tdata of treeData.data.tree) {
    if (tdata.path.split("/")[0] === "output") {
      keyArr.push(tdata);
    }
  }
  var paths = keyArr;
  result = keyArr.reduce((r, p) => {
    if (p.type === "blob") {
      p.icon = "ri-file-text-line";
    }
    var texts = p.path.split("/");
    texts.shift();
    texts.reduce((q, text) => {
      var temp = q.find((o) => o.text === text);
      if (!temp)
        q.push(
          (temp = {
            text,
            children: [],
            sha: p.sha,
            icon: p.icon,
            opened: true,
          })
        );
      return temp.children;
    }, r);
    return r;
  }, []);

  return result;
}
// Get object of github tree
async function getGithubTree(gitToken, repouser, reponame, branchsha) {
  let treeData = await axios({
    method: "get",
    url: `https://api.github.com/repos/${repouser}/${reponame}/git/trees/${branchsha}?recursive=true`,
    headers: {
      Authorization: "token " + gitToken,
    },
  });
  result = treeData.data.tree.reduce((r, p) => {
    if (p.type === "blob") {
      p.icon = "ri-file-text-line";
    }
    var texts = p.path.split("/");
    texts.reduce((q, text) => {
      var temp = q.find((o) => o.text === text);
      if (!temp)
        q.push(
          (temp = {
            text,
            children: [],
            sha: p.sha,
            path: p.path,
            icon: p.icon,
            opened: true,
          })
        );
      return temp.children;
    }, r);
    return r;
  }, []);

  return result;
}
// add/ create all admin project
async function addAllAdminProject() {
  try {
    let syncProjectArr = [];
    let orgArr = await Organization.find();
    if (orgArr) {
      for await (const orgData of orgArr) {
        let adminDataArr = await Admin.find({ orgId: orgData.id });
        if (adminDataArr) {
          for await (const adminData of adminDataArr) {
            let gitAuthTokenData = await GitAuthToken.findOne({
              userId: adminData.id,
            });
            let syncProjectData = await syncProject(
              gitAuthTokenData.token,
              orgData.id,
              adminData.id
            );
            syncProjectArr.push(syncProjectData);
          }
        }
      }
    }
    return syncProjectArr;
  } catch (err) {
    return err;
  }
}
