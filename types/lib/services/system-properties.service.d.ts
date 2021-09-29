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
     * @returns {Promise<Object>} response object, with these properties `AccountUDN`
     */
    AddAccountX(options?: {
        AccountType: number;
        AccountID: string;
        AccountPassword: string;
    }): Promise<any>;
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
     * @returns {Promise<Object>} response object, with these properties `AccountUDN`, `AccountNickname`
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
    }): Promise<any>;
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
     * @returns {Promise<Object>} response object, with these properties `RDMValue`
     */
    GetRDM(): Promise<any>;
    /**
     * GetString - Get a saved string.
     *
     * @param {Object} [options] - An object with the following properties
     * @param {string} options.VariableName - The key for this variable
     * @remarks Strings are saved in the system with SetString, every speaker should return the same data. Will error when not existing
     * @returns {Promise<Object>} response object, with these properties `StringValue`
     */
    GetString(options?: {
        VariableName: string;
    }): Promise<any>;
    /**
     * GetWebCode
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.AccountType
     * @returns {Promise<Object>} response object, with these properties `WebCode`
     */
    GetWebCode(options?: {
        AccountType: number;
    }): Promise<any>;
    /**
     * ProvisionCredentialedTrialAccountX
     *
     * @param {Object} [options] - An object with the following properties
     * @param {number} options.AccountType
     * @param {string} options.AccountID
     * @param {string} options.AccountPassword
     * @returns {Promise<Object>} response object, with these properties `IsExpired`, `AccountUDN`
     */
    ProvisionCredentialedTrialAccountX(options?: {
        AccountType: number;
        AccountID: string;
        AccountPassword: string;
    }): Promise<any>;
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
     * @returns {Promise<Object>} response object, with these properties `NewAccountUDN`
     */
    ReplaceAccountX(options?: {
        AccountUDN: string;
        NewAccountID: string;
        NewAccountPassword: string;
        AccountToken: string;
        AccountKey: string;
        OAuthDeviceID: string;
    }): Promise<any>;
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
