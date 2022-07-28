import AWS from 'aws-sdk'

export const sendEmailConfirmationEmail = (mailData: {email: string, userDisplayName: string, activationLink: string}) => {
    var params = {
        Destination: { 
            CcAddresses: [
                mailData.email,
            ],
            ToAddresses: [
                mailData.email
            ]
        },
        Source: process.env.NO_REPLY_EMAIL_ADDRESS,
        Template: 'Account_Activation_Email',
        TemplateData: JSON.stringify({
            userDisplayName: mailData.userDisplayName || '',
            applicationName: 'NODEJS_AUTH_SERVER',
            companyAddress: 'Dhaka, Bangladesh',
            activationLink: mailData.activationLink
        }),
        ReplyToAddresses: [
            process.env.NO_REPLY_EMAIL_ADDRESS
        ],
    }

    var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendTemplatedEmail(params).promise()
    sendPromise.then(data => {
        console.log(data)
    }).catch(err => {
        console.error(err, err.stack)
    });
}

//export const sendResetPasswordEmail = (email: string, userDisplayName: string | undefined, token: string) => {
export const sendResetPasswordEmail = (mailData: {email: string, userDisplayName: string, passwordResetLink: string}) => {
    //console.log(`http://localhost:3000/reset_password_confirm?email=${email}&token=${token}`)

    const params = {
        Destination: { 
            CcAddresses: [
                mailData.email,
            ],
            ToAddresses: [
                mailData.email
            ]
        },
        Source: 'process.env.NO_REPLY_EMAIL_ADDRESS',
        Template: 'Reset_Password_Email',
        TemplateData: JSON.stringify({
            userDisplayName: mailData.userDisplayName || '',
            applicationName: 'NODEJS_AUTH_SERVER',
            companyAddress: 'Dhaka, Bangladesh',
            passwordResetLink: mailData.passwordResetLink
        }),
        ReplyToAddresses: [
            process.env.NO_REPLY_EMAIL_ADDRESS
        ],
    }

    const sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendTemplatedEmail(params).promise()
    sendPromise.then(data => {
        console.log(data)
    }).catch(err => {
        console.error(err, err.stack)
    });
}

/**

https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/ses-examples-sending-email.html
 */
