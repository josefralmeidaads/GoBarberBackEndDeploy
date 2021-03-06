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
    //teste
    @Expose({ name: 'avatar_url' })
    getAvatarUrl(): string | undefined {

      if(!this.avatar){
        if(this.avatar === undefined){
          this.avatar = String(null)
        }
        return this.avatar
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