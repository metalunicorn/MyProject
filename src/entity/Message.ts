import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Messages {

    

    @PrimaryGeneratedColumn('increment')
    public id: number;

    @Column()
    userId: number;

    @Column()
    user: string;

    @Column("text")
    message: string;


    @Column()
    color: string;


    @Column({ type: 'timestamp' })
    createAt: Date;

}
