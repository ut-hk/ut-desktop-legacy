/**
 * ProjectIntelligence.WebApi
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

export interface SubmissionFolderDto {
    submissions?: Array<models.SubmissionDto>;

    companies?: Array<models.ActionPartyDto>;

    childFolders?: Array<models.SubmissionFolderListDto>;

    name?: string;

    description?: string;

    type?: SubmissionFolderDto.TypeEnum;

    creationTime?: Date;

    depth?: number;

    overallStatus?: SubmissionFolderDto.OverallStatusEnum;

    id?: string;

}
export namespace SubmissionFolderDto {
    export enum TypeEnum {
        NUMBER_0 = <any> 0,
        NUMBER_1 = <any> 1,
        NUMBER_2 = <any> 2,
        NUMBER_3 = <any> 3
    }
    export enum OverallStatusEnum {
        NUMBER_0 = <any> 0,
        NUMBER_200 = <any> 200,
        NUMBER_300 = <any> 300,
        NUMBER_400 = <any> 400
    }
}