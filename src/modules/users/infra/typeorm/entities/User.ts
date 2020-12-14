import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import uploadConfig from '../../../../../config/upload';

@Entity('users')
export class User{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    update_at: Date;

    @Column()
    avatar: string;

    @Expose({ name: 'avatar_url' })
    getAvatarUrl(): string | null{

      if(!this.avatar){
        return null;
      }

      switch(uploadConfig.driver){
        case 'disk': {
          return `${process.env.APP_API_URL}/files/${this.avatar}`;
        } break;

        case 's3': {
          return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.avatar}`;
        } break;

        default:
        break;
      }
    }
}

export default User;