/**
 * UniTime.WebApi
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

import * as models from './models';

export interface ChatRoomMessageDto {
    message?: string;

    type?: ChatRoomMessageDto.TypeEnum;

    ownerId?: number;

    creationTime?: Date;

    id?: number;

}
export namespace ChatRoomMessageDto {
    export enum TypeEnum {
        NUMBER_0 = <any> 0,
        NUMBER_1 = <any> 1
    }
}