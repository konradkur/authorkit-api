import {
    Controller,
    UseGuards,
    ClassSerializerInterceptor,
    UseInterceptors,
    Post,
    Delete,
    Param,
    ForbiddenException,
    UploadedFile,
    Body,
    Patch,
    Get
} from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiConsumes, ApiImplicitBody, ApiImplicitFile } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import { User } from '../_helpers/decorators/user.decorator';
import { ExerciseService } from '../exercises/exercise.service';
import { AccessLevel } from '../permissions/entity/access-level.enum';

import { TestGeneratorEntity } from './entity/test-generator.entity';
import { TestGeneratorService } from './test-generator.service';


@Controller('test-generators')
@ApiUseTags('test-generators')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
export class TestGeneratorController {

    constructor(
        protected readonly service: TestGeneratorService,
        protected readonly exerciseService: ExerciseService
    ) {}

    @Get('/:id/contents')
    async read(
        @User() user: any,
        @Param('id') id: string
    ): Promise<string> {
        const accessLevel = await this.service.getAccessLevel(id, user.id);
        if (accessLevel < AccessLevel.VIEWER) {
            throw new ForbiddenException(`You do not have sufficient privileges`);
        }
        return this.service.getContents(user, id);
    }

    @Get('/:id')
    async get(
        @User() user: any,
        @Param('id') id: string
    ): Promise<TestGeneratorEntity> {
        const accessLevel = await this.service.getAccessLevel(id, user.id);
        if (accessLevel < AccessLevel.VIEWER) {
            throw new ForbiddenException(`You do not have sufficient privileges`);
        }
        return this.service.getOne(user, id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'file', required: true })
    @ApiImplicitBody({ name: 'test-generator', type: TestGeneratorEntity })
    async create(
        @User() user: any,
        @UploadedFile() file,
        @Body() dto: TestGeneratorEntity
    ): Promise<TestGeneratorEntity> {
        const accessLevel = await this.exerciseService.getAccessLevel(dto.exercise_id, user.id);
        if (accessLevel < AccessLevel.CONTRIBUTOR) {
            throw new ForbiddenException(
                `You do not have sufficient privileges`);
        }
        return await this.service.createOne(user, dto, file);
    }

    @Patch('/:id')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'file', required: true })
    @ApiImplicitBody({ name: 'test-generator', type: TestGeneratorEntity })
    async update(
        @User() user: any,
        @Param('id') id: string,
        @UploadedFile() file,
        @Body() dto: TestGeneratorEntity
    ): Promise<TestGeneratorEntity> {
        const accessLevel = await this.service.getAccessLevel(id, user.id);
        if (accessLevel < AccessLevel.CONTRIBUTOR) {
            throw new ForbiddenException(`You do not have sufficient privileges`);
        }
        return await this.service.updateOne(user, id, dto, file);
    }

    @Delete('/:id')
    async delete(@User() user: any, @Param('id') id: string): Promise<TestGeneratorEntity> {
        const accessLevel = await this.service.getAccessLevel(id, user.id);
        if (accessLevel < AccessLevel.CONTRIBUTOR) {
            throw new ForbiddenException(`You do not have sufficient privileges`);
        }
        return await this.service.deleteOne(user, id);
    }
}
