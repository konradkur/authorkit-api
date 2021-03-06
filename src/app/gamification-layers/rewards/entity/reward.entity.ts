import { ApiModelProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, OneToMany, ManyToMany, JoinTable, OneToOne, RelationId } from 'typeorm';
import { Field } from 'type-graphql';
import { IsOptional, IsEmpty, IsDefined, IsUUID, IsNotEmpty, IsString, MaxLength, IsEnum, IsArray, IsNumber } from 'class-validator';
import { CrudValidationGroups } from '@nestjsx/crud';

import { TrackedFileEntity } from '../../../_helpers/entity/tracked-file.entity';
import { ExerciseEntity } from '../../../exercises/entity/exercise.entity';
import { ChallengeEntity } from '../../challenges/entity/challenge.entity';
import { CriteriaEntity } from '../../rules/entity/criteria.entity';
import { GamificationLayerEntity } from '../../entity/gamification-layer.entity';
import { RewardKind } from '../entity/reward-kind.enum';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity('gl-reward')
export class RewardEntity extends TrackedFileEntity {

    @ApiModelProperty()
    @IsOptional({ groups: [UPDATE] })
    @IsEmpty({ groups: [CREATE] })
    @PrimaryGeneratedColumn('uuid')
    @Field()
    public id: string;

    @ApiModelProperty()
    @IsOptional({ always: true })
    @IsUUID('4', { always: true })
    @ManyToOne(() => GamificationLayerEntity, gl => gl.rewards, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'gl_id' })
    @Column('uuid', { nullable: false })
    @Field()
    public gl_id: string;

    @ApiModelProperty()
    @IsOptional({ always: true })
    @IsUUID('4', { always: true })
    @ManyToOne(() => ChallengeEntity, challenge => challenge.rewards, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'challenge_id' })
    @Column('uuid', { nullable: true })
    @Field()
    public challenge_id: string;

    @ApiModelProperty()
    @IsOptional({ groups: [UPDATE] })
    @IsDefined({ groups: [CREATE] })
    @IsNotEmpty({ always: true })
    @IsString({ always: true })
    @MaxLength(150, { always: true })
    @Column('varchar', { length: 150, nullable: false })
    @Field()
    public name: string;

    @ApiModelProperty()
    @IsOptional({ always: true })
    @IsString({ always: true })
    @MaxLength(500, { always: true })
    @Column('varchar', { length: 500, nullable: true })
    @Field()
    public description: string;

    @ApiModelProperty()
    @IsOptional({ groups: [UPDATE] })
    @IsDefined({ groups: [CREATE] })
    @IsEnum(RewardKind, { always: true })
    @Column({
        type: 'enum',
        enum: RewardKind
    })
    public kind: RewardKind;

    @ApiModelProperty()
    @IsOptional({ always: true })
    @IsNumber({ allowNaN: false, allowInfinity: false }, { always: true })
    @Column('real', { nullable: true })
    @Field()
    public amount: number;

    @ApiModelProperty()
    @ManyToMany(() => ExerciseEntity, exercise => exercise.unlocked_by)
    @JoinTable({
        joinColumn: { name: 'reward_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'exercise_id', referencedColumnName: 'id' }
    })
    @Field(() => [ExerciseEntity])
    public unlockable_exercises: ExerciseEntity[];

    @RelationId((reward: RewardEntity) => reward.unlockable_exercises)
    public unlockable_exercise_ids: string[];

    @ApiModelProperty()
    @ManyToMany(() => ChallengeEntity, challenge => challenge.unlocked_by)
    @JoinTable({
        joinColumn: { name: 'reward_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'challenge_id', referencedColumnName: 'id' }
    })
    @Field(() => [ChallengeEntity])
    public unlockable_challenges: ChallengeEntity[];

    @RelationId((reward: RewardEntity) => reward.unlockable_challenges)
    public unlockable_challenge_ids: string[];

    @ApiModelProperty()
    @ManyToMany(() => ExerciseEntity, exercise => exercise.revealed_by)
    @JoinTable({
        joinColumn: { name: 'reward_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'exercise_id', referencedColumnName: 'id' }
    })
    @Field(() => [ExerciseEntity])
    public revealable_exercises: ExerciseEntity[];

    @RelationId((reward: RewardEntity) => reward.revealable_exercises)
    public revealable_exercise_ids: string[];

    @ApiModelProperty()
    @ManyToMany(() => ChallengeEntity, challenge => challenge.revealed_by)
    @JoinTable({
        joinColumn: { name: 'reward_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'challenge_id', referencedColumnName: 'id' }
    })
    @Field(() => [ChallengeEntity])
    public revealable_challenges: ChallengeEntity[];

    @RelationId((reward: RewardEntity) => reward.revealable_challenges)
    public revealable_challenge_ids: string[];

    @ApiModelProperty()
    @IsOptional({ always: true })
    @IsArray({ always: true })
    @IsString({ always: true, each: true })
    @MaxLength(250, { always: true, each: true })
    @Column('simple-array', { default: '' })
    public hints: string[];

    @ApiModelProperty()
    @IsOptional({ always: true })
    @IsArray({ always: true })
    @IsString({ always: true, each: true })
    @MaxLength(250, { always: true, each: true })
    @Column('simple-array', { default: '' })
    public congratulations: string[];

    @ApiModelProperty()
    @IsOptional({ always: true })
    @Column('simple-json', { nullable: true })
    @Field(() => CriteriaEntity)
    public criteria: CriteriaEntity;
}
