/* eslint-disable @typescript-eslint/no-var-requires */
import * as jwt  from 'jsonwebtoken';
import {User} from "./entity/User";
import {Messages} from "./entity/Message";
import {getManager, Timestamp} from "typeorm";

const SocketIO = function socketIoStart(io:any): void {
  io.use(async (socket, next) => {
    try {
      if (!socket.handshake.auth.token) {
        return;
      }
      const { token } = socket.handshake.auth;
      const payload = jwt.verify(token, process.env.SECRET);
      const UserRepository = getManager().getRepository(User)
      const [user] = await UserRepository.find({where:{ name: (<any>payload).name }});
      if (!user) {
        return;
      }

      //eslint-disable-next-line no-param-reassign

      socket.user = <boolean>(
        Object.prototype.hasOwnProperty.call(socket, 'user')
      )
        ? socket.user
        : user;
      if (user.ban) {
        socket.disconnect();
        return;
      }
      next();
    } catch (err) {
      socket.disconnect();
    }
  });
  type Users = {
    [users: string]: {
      name: string;
      socket: string;
    };
  };

  const users = <Users>{};

  io.on('connection', async (socket) => {
    const UserRepository = getManager().getRepository(User)
    const MessageRepository = getManager().getRepository(Messages)
    users[socket.user.name] = { name: socket.user.name, socket: socket.id };
    socket.on('disconnect', () => {
      delete users[socket.user.name];
      io.emit('UsersOnline', users);
    });
    io.emit('UsersOnline', users);

    const showAllusers = async () => {
      if (!socket.user.admin) {
        return;
      }

      interface allUsers {
        _id: string;
        name: string;
        admin: boolean;
        mute: boolean;
        ban: boolean;
      }

      const allUsers = await UserRepository.find();
      socket.emit('ShowAllUsers', allUsers);
    };

    showAllusers();

    interface lastMessages {
      _id: string;
      message: string;
      id: string;
      user: string;
      time: string;
      color: string;
    }
    const lastMessages = await MessageRepository.find({order: {id: "DESC" },take: 10});
    console.log(lastMessages)
    io.emit('Messages', { prevMessages: lastMessages });

    socket.on('Message', async (send: { message: string }) => {
      const [userMute] = await UserRepository.find({where:{id: socket.user.id}});
      if (userMute.mute) {
        return;
      }

      if (!(send.message.trim().length > 0) || send.message.length > 200) {
        return;
      }

      interface lastMessage {
        id: string;
        message: string;
        user: string;
        time: number;
        color: string;
        crearedAt: Date;
        updatedAt: Date;
      }

      const [lastMessage] = await MessageRepository.find({order: {id:"DESC" },take: 1});
      if (
        lastMessage &&
        Date.now() - Date.parse(`${lastMessage.createAt}`) < Number(process.env.TIMEMESSAGE)
      ) {
        return;
      }

      const newMessage = new Messages()
        newMessage.message = send.message,
        newMessage.userId = socket.user.id,
        newMessage.user = socket.user.name,
        newMessage.createAt =  new Date(),
        newMessage.color = socket.user.color,
      console.log(newMessage)
      await MessageRepository.save(newMessage);

      io.emit('newMessage', {
        message: send.message,
        user: socket.user.name,
        color: socket.user.color,
        userId: socket.user.id,
        createAt: new Date()
      });
    });

    interface ID {
      _id: string;
    }
    
    socket.on('Mute', async (user: ID) => {
      if (!socket.user.admin) {
        return;
      }
      console.log(user._id)
      const [muteUser] = await UserRepository.find({where:{ id: user._id }});
      console.log(muteUser)
      muteUser.mute = !muteUser.mute;
      
      await UserRepository.save(muteUser);
      showAllusers();
    });

    socket.on('Ban', async (user: { _id: string }) => {
      if (!socket.user.admin) {
        return;
      }
      const [userIsBan] = await UserRepository.find({where:{ id: user._id }});
      userIsBan.ban = !userIsBan.ban;

      if (userIsBan.ban && users[userIsBan.name]) {
        io.sockets.sockets.get(users[userIsBan.name].socket).disconnect();
      }

      await UserRepository.save(userIsBan);
      showAllusers();
    });
  });
};

export default SocketIO
