import {Injectable} from '@nestjs/common';
import {Agreement, User} from "@prisma/client";
import {CreateUserDto} from "../auth/dto/create-user.dto";
import {PrismaService} from "../core/prisma.service";


@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {
    }

    getUserById(id: string): Promise<User> {
        return this.prismaService.user.findUnique({
            where: {id: id},
        });
    }

    async getUserByEmail(email: string): Promise<User> {
        return this.prismaService.user.findUnique({where: {email: email}});
    }

    async createUser(user: CreateUserDto): Promise<User> {
        return this.prismaService.user.create({data: user});
    }

    async deleteUser(data: any): Promise<User> {
        const {email} = data
        return this.prismaService.user.delete({where: {email:email}});
    }

    async updateUser(emails: string, data: any) {
        return this.prismaService.user.update({where: {email: emails}, data})
    }

    async createAgreement(userId: string, url: string): Promise<Agreement> {
        const agreement = await this.prismaService.agreement.create({
            data: {
                file: `https://traccy.${url}`, // Save the file data to the 'file' field in the database
                author: {connect: {id: userId}}, // Connect the author (user) to the agreement
            },
        });

        return agreement;
    }

}
