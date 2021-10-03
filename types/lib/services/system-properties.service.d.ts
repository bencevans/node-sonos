export = SystemPropertiesService;
/**
 * Sonos SystemPropertiesService
 *
 * Manage system-wide settings, mainly account stuff
 *
 * @author Stephan van Rooij - https://svrooij.io
 * @remarks This file is generated, do not edit manually. https://svrooij.io/sonos-api-docs
 * @export
 * @class SystemPropertiesService
 * @extends {Service}
 */
declare class SystemPropertiesService extends Service {
    /**
     *
     * @param {string} host Sonos host
     * @param {number} port Sonos port, default `1400`
     */
    constructor(host: string, port: number);
    /**
     * AddAccountX
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.AccountType
     * @param {string} options.AccountID
     * @param {string} options.AccountPassword
     * @returns {Promise<{ AccountUDN: string}>} response object.
     */
    AddAccountX(options?: {
        AccountType: number;
        AccountID: string;
        AccountPassword: string;
    }): Promise<{
        AccountUDN: string;
    }>;
    /**
     * AddOAuthAccountX
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.AccountType
     * @param {string} options.AccountToken
     * @param {string} options.AccountKey
     * @param {string} options.OAuthDeviceID
     * @param {string} options.AuthorizationCode
     * @param {string} options.RedirectURI
     * @param {string} options.UserIdHashCode
     * @param {number} options.AccountTier
     * @returns {Promise<{ AccountUDN: string, AccountNickname: string}>} response object.
     */
    AddOAuthAccountX(options?: {
        AccountType: number;
        AccountToken: string;
        AccountKey: string;
        OAuthDeviceID: string;
        AuthorizationCode: string;
        RedirectURI: string;
        UserIdHashCode: string;
        AccountTier: number;
    }): Promise<{
        AccountUDN: string;
        AccountNickname: string;
    }>;
    /**
     * DoPostUpdateTasks
     * @returns {Promise<Boolean>} request succeeded
     */
    DoPostUpdateTasks(): Promise<boolean>;
    /**
     * EditAccountMd
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.AccountType
     * @param {string} options.AccountID
     * @param {string} options.NewAccountMd
     * @returns {Promise<Boolean>} request succeeded
     */
    EditAccountMd(options?: {
        AccountType: number;
        AccountID: string;
        NewAccountMd: string;
    }): Promise<boolean>;
    /**
     * EditAccountPasswordX
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.AccountType
     * @param {string} options.AccountID
     * @param {string} options.NewAccountPassword
     * @returns {Promise<Boolean>} request succeeded
     */
    EditAccountPasswordX(options?: {
        AccountType: number;
        AccountID: string;
        NewAccountPassword: string;
    }): Promise<boolean>;
    /**
     * EnableRDM
     *
     * @param {Object} [options] - An object with the following properties
     * @param {boolean} options.RDMValue
     * @returns {Promise<Boolean>} request succeeded
     */
    EnableRDM(options?: {
        RDMValue: boolean;
    }): Promise<boolean>;
    /**
     * GetRDM
     * @returns {Promise<{ RDMValue: boolean}>} response object.
     */
    GetRDM(): Promise<{
        RDMValue: boolean;
    }>;
    /**
     * GetString - Get a saved string.
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.VariableName - The key for this variable
     * @remarks Strings are saved in the system with SetString, every speaker should return the same data. Will error when not existing
     * @returns {Promise<{ StringValue: string}>} response object.
     */
    GetString(options?: {
        VariableName: string;
    }): Promise<{
        StringValue: string;
    }>;
    /**
     * GetWebCode
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.AccountType
     * @returns {Promise<{ WebCode: string}>} response object.
     */
    GetWebCode(options?: {
        AccountType: number;
    }): Promise<{
        WebCode: string;
    }>;
    /**
     * ProvisionCredentialedTrialAccountX
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.AccountType
     * @param {string} options.AccountID
     * @param {string} options.AccountPassword
     * @returns {Promise<{ IsExpired: boolean, AccountUDN: string}>} response object.
     */
    ProvisionCredentialedTrialAccountX(options?: {
        AccountType: number;
        AccountID: string;
        AccountPassword: string;
    }): Promise<{
        IsExpired: boolean;
        AccountUDN: string;
    }>;
    /**
     * RefreshAccountCredentialsX
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.AccountType
     * @param {number} options.AccountUID
     * @param {string} options.AccountToken
     * @param {string} options.AccountKey
     * @returns {Promise<Boolean>} request succeeded
     */
    RefreshAccountCredentialsX(options?: {
        AccountType: number;
        AccountUID: number;
        AccountToken: string;
        AccountKey: string;
    }): Promise<boolean>;
    /**
     * Remove - Remove a saved string
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.VariableName - The key for this variable
     * @remarks Not sure what happens if you call this with a VariableName that doesn't exists.
     * @returns {Promise<Boolean>} request succeeded
     */
    Remove(options?: {
        VariableName: string;
    }): Promise<boolean>;
    /**
     * RemoveAccount
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.AccountType
     * @param {string} options.AccountID
     * @returns {Promise<Boolean>} request succeeded
     */
    RemoveAccount(options?: {
        AccountType: number;
        AccountID: string;
    }): Promise<boolean>;
    /**
     * ReplaceAccountX
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.AccountUDN
     * @param {string} options.NewAccountID
     * @param {string} options.NewAccountPassword
     * @param {string} options.AccountToken
     * @param {string} options.AccountKey
     * @param {string} options.OAuthDeviceID
     * @returns {Promise<{ NewAccountUDN: string}>} response object.
     */
    ReplaceAccountX(options?: {
        AccountUDN: string;
        NewAccountID: string;
        NewAccountPassword: string;
        AccountToken: string;
        AccountKey: string;
        OAuthDeviceID: string;
    }): Promise<{
        NewAccountUDN: string;
    }>;
    /**
     * ResetThirdPartyCredentials
     * @returns {Promise<Boolean>} request succeeded
     */
    ResetThirdPartyCredentials(): Promise<boolean>;
    /**
     * SetAccountNicknameX
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.AccountUDN
     * @param {string} options.AccountNickname
     * @returns {Promise<Boolean>} request succeeded
     */
    SetAccountNicknameX(options?: {
        AccountUDN: string;
        AccountNickname: string;
    }): Promise<boolean>;
    /**
     * SetString - Save a string in the system
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.VariableName - The key for this variable, use something unique
     * @param {string} options.StringValue
     * @remarks Strings are saved in the system, retrieve values with GetString.
     * @returns {Promise<Boolean>} request succeeded
     */
    SetString(options?: {
        VariableName: string;
        StringValue: string;
    }): Promise<boolean>;
}
import Service = require("./Service");
