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

export interface MeetingFolderDto {
    dateOfMeeting?: Date;

    timeOfMeeting?: Date;

    attendees?: Array<models.CompanyDto>;

    parentFolderId?: string;

    files?: Array<models.FileDto>;

    childFolders?: Array<models.FolderListDto>;

    name?: string;

    description?: string;

    type?: MeetingFolderDto.TypeEnum;

    creationTime?: Date;

    depth?: number;

    id?: string;

}
export namespace MeetingFolderDto {
    export enum TypeEnum {
        NUMBER_0 = <any> 0,
        NUMBER_1 = <any> 1,
        NUMBER_2 = <any> 2,
        NUMBER_3 = <any> 3
    }
}