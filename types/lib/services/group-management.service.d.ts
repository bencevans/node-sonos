export = GroupManagementService;
/**
 * Sonos GroupManagementService
 *
 * Services related to groups
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class GroupManagementService
 * @extends {Service}
 */
declare class GroupManagementService extends Service {
    /**
     *
     * @param {string} host Sonos host
     * @param {number} port Sonos port, default `1400`
     */
    constructor(host: string, port: number);
    /**
     * AddMember
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.MemberID
     * @param {number} options.BootSeq
     * @returns {Promise<{ CurrentTransportSettings: string, CurrentURI: string, GroupUUIDJoined: string, ResetVolumeAfter: boolean, VolumeAVTransportURI: string}>} response object.
     */
    AddMember(options?: {
        MemberID: string;
        BootSeq: number;
    }): Promise<{
        CurrentTransportSettings: string;
        CurrentURI: string;
        GroupUUIDJoined: string;
        ResetVolumeAfter: boolean;
        VolumeAVTransportURI: string;
    }>;
    /**
     * RemoveMember
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.MemberID
     * @returns {Promise<Boolean>} request succeeded
     */
    RemoveMember(options?: {
        MemberID: string;
    }): Promise<boolean>;
    /**
     * ReportTrackBufferingResult
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.MemberID
     * @param {number} options.ResultCode
     * @returns {Promise<Boolean>} request succeeded
     */
    ReportTrackBufferingResult(options?: {
        MemberID: string;
        ResultCode: number;
    }): Promise<boolean>;
    /**
     * SetSourceAreaIds
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.DesiredSourceAreaIds
     * @returns {Promise<Boolean>} request succeeded
     */
    SetSourceAreaIds(options?: {
        DesiredSourceAreaIds: string;
    }): Promise<boolean>;
}
import Service = require("./Service");
