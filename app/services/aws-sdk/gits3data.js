const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../config/db');
const User = db.gits3data;

module.exports = {
    getAll,
    create,
    delete: _delete
};

async function getAll() {
    return await User.find();
}

async function create(userParam) {

    const user = new User(userParam);
    await user.save();
}

// async function update() {
//     User.updateOne(
//         { repopath: "test" },
//         { $addToSet: { filedata: [{path: "new", content: "mnjhs" }] } },
//         function(err, result) {
//           if (err) {
//             res.send(err);
//           } else {
//             res.send(result);
//           }
//         }
//       );
// }

async function _delete(id) {
    await User.findByIdAndRemove(id);
    // await User.deleteMany({})
}


// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const db = require('../../config/db');
// const User = db.gits3data;

// module.exports = {
//     getAll,
//     create,
//     delete: _delete
// };

// async function getAll() {
//     return await User.find();
// }

// async function create(userParam) {

//     const user = new User(userParam);

//     // save user
//     await user.save();
// }

// async function _delete() {
//     await User.deleteMany({})
// }