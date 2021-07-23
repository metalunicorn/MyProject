const jwtReg = require('jsonwebtoken');
const sha256Reg = require('js-sha256');
import {User} from "../entity/User";
import {getManager} from "typeorm";

const reg = async function Registration(
  name: string,
  admin: boolean,
  password: string
) {
  const color = [
    '#560c0d',
    '#330c56',
    '#1e2c96',
    '#000000',
    '#1c3652',
    '#3e5d62',
  ];

const randomColor = color[Math.floor(Math.random() * color.length)];
const UserRepository = getManager().getRepository(User)
const newUser = new User()
newUser.name = name,
newUser.admin = admin,
newUser.password = sha256Reg(password + process.env.SALT),
newUser.color = randomColor,
newUser.mute = false,
newUser.ban = false,
console.log('NewUser', newUser);
await UserRepository.save(newUser);


  return jwtReg.sign({ admin, name }, process.env.SECRET);
};

const admin = async function isAdmin() {
  let roleAdmin = false;

  const UserRepository = getManager().getRepository(User)
  const admin = await UserRepository.find()
  if(admin === []){
    roleAdmin = true
  }
  return roleAdmin;
};

const findUser = async function findUser(name: string) {
//   const userReg = await UserReg.findOne({
//     name,
//   });
    const UserRepository = getManager().getRepository(User)
    const isUser = await UserRepository.find({where: {name: name}})
  return isUser[0];
};

export { reg, admin, findUser };
