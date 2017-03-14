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

export interface UpdateMyUserInput {
    name: string;

    surname: string;

    phoneNumber?: string;

    gender?: UpdateMyUserInput.GenderEnum;

    birthday?: Date;

    coverId?: string;

}
export namespace UpdateMyUserInput {
    export enum GenderEnum {
        NUMBER_1 = <any> 1,
        NUMBER_2 = <any> 2,
        NUMBER_3 = <any> 3
    }
}
