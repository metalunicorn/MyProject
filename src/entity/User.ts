import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column()
    admin: boolean;

    @Column()
    color: string;

    @Column()
    mute: boolean;

    @Column()
    ban: boolean;

}