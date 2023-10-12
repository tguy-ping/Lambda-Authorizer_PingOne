const oidc = require('oidc');
const policy = require('awsPolicy');

exports.handler = async(event, context) => {
    let iamPolicy = policy.defaultDenyAllPolicy;
    let user;
    let machine;
    
    const bearerToken = event.authorizationToken.replace("Bearer ", "");
    console.log('JWT Token', bearerToken);
    
    user = await oidc.remoteValidate(bearerToken);
    machine = await oidc.workerValidate(bearerToken);
    const payload = user || machine;
    
    if (payload) {
        iamPolicy =  policy.generateIAMPolicy(payload);
    }
    console.log('IAM Policy', JSON.stringify(iamPolicy));
    return iamPolicy;
};