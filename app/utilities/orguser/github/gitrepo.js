const axios = require("axios");

// function for getting all commits across all branch in a repository
exports.getCommitsAcrossAllBranch = async function (
  branchList,
  gitToken,
  repoUser,
  repoName,
  timeFilter,
  recentCommitsList
) {
  try {
    //fetching commits for each branch since last day
    for (branch of branchList) {
      const { name: branchName } = branch;
      const { data: commitList } = await axios({
        method: "get",
        url: `https://api.github.com/repos/${repoUser}/${repoName}/commits?sha=${branchName}&since=${timeFilter}`,
        headers: {
          Authorization: "token " + gitToken,
        },
      });
      // pushing each commit data in recent commit list
      commitList.forEach((data) => {
        data.projectName = repoName
        recentCommitsList.push(data);
      });
    }
    return recentCommitsList;
  } catch (error) {
    return recentCommitsList;
  }
};
