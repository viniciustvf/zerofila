"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordEmail = exports.forgotPasswordEmail = exports.registrationEmail = void 0;
const registrationEmail = (user) => {
    return `<html>
            <body>
              <div>
                <p>Hi ${user.name}!</p>
                <p>You did it! You registered!, You're successfully registered.✔</p>
              </div>
            </body>
          </html>
  `;
};
exports.registrationEmail = registrationEmail;
const forgotPasswordEmail = (password) => {
    return `<html>
            <body>
              <div>
                <p>Request Reset Password Successfully!  ✔</p>
                <p>This is your new password: <b>${password}</b></p>
              </div>
            </body>
          </html>
  `;
};
exports.forgotPasswordEmail = forgotPasswordEmail;
const changePasswordEmail = (user) => {
    return `<html>
            <body>
              <div>
                <p>Change Password Successfully! ✔ </p>
                <p>this is your new password: ${user.password}</p>
              </div>
            </body>
          </html>
  `;
};
exports.changePasswordEmail = changePasswordEmail;
//# sourceMappingURL=mailer.constants.js.map