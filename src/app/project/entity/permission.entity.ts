import { ApiModelProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Field } from 'type-graphql';
import { IsString, IsEnum } from 'class-validator';

import { ExtendedEntity } from '../../_helpers';
import { UserEntity } from '../../user/entity';
import { UserContextRole } from '../../access-control';
import { ProjectEntity } from './project.entity';

@Entity('permission')
export class PermissionEntity extends ExtendedEntity {

    @PrimaryColumn('uuid')
    @ManyToOne(type => ProjectEntity, project => project.id)
    @JoinColumn({ name: 'project_id' })
    @Field()
    public project_id: string;

    @PrimaryColumn('uuid')
    @ManyToOne(type => UserEntity, user => user.id)
    @JoinColumn({ name: 'user_id' })
    @Field()
    public user_id: string;

    @IsEnum(UserContextRole)
    @Column('enum', {
        enum: UserContextRole
    })
    @Field(type => UserContextRole)
    public role: UserContextRole;
}
