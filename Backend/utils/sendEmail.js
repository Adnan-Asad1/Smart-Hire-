import nodemailer from 'nodemailer';
export const sendResetEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Your OTP Code to Reset Password',
    html: `
      <h3>Your OTP Code:</h3>
      <h2 style="color:blue;">${otp}</h2>
      <p>This code is valid for 10 minutes. Do not share it with anyone.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ✅ NEW function: sendInterviewLinks
export const sendInterviewLinks = async (to, link) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"AI Recruiter" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: '📩 Your AI Interview Invitation',
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          
          <h2 style="text-align: center; color: #2d89ef; margin-bottom: 10px;">🤖 AI Recruiter</h2>
          <hr style="border: none; height: 2px; background: #2d89ef; margin: 15px 0;">
          
          <h3 style="color: #333;">Hello Candidate,</h3>
          <p style="font-size: 15px; color: #555;">
            We are excited to invite you for your upcoming AI-powered interview. 
            Please find your unique interview link below:
          </p>
          
          <!-- 🚀 Button Link -->
          <div style="text-align: center; margin: 25px 0;">
            <a href="${link}" target="_blank" 
              style="background: #2d89ef; color: white; padding: 12px 25px; 
                     text-decoration: none; font-size: 16px; font-weight: bold; 
                     border-radius: 8px; display: inline-block;">
              Start Your Interview 🚀
            </a>
          </div>

          <!-- ✅ Show actual link as plain text also -->
          <p style="text-align: center; font-size: 14px; color: #333; margin-top: 15px;">
            Or copy & paste this link into your browser:<br/>
            <a href="${link}" target="_blank" style="color:#2d89ef;">${link}</a>
          </p>
          
          <p style="font-size: 14px; color: #444; margin-top: 20px;">
            ⏰ This interview link will remain valid for <strong>30 days</strong>.
          </p>
          
          <p style="font-size: 14px; color: #444;">
            We wish you the best of luck and look forward to your responses. 🌟
          </p>
          
          <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;">
          
          <p style="font-size: 13px; text-align: center; color: #888;">
            Regards,<br/>
            <strong>AI Recruiter Team</strong><br/>
            <a href="https://your-website.com" style="color: #2d89ef; text-decoration: none;">www.airecruiter.com</a>
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};



export const sendLeaveDecisionEmail = async (to, employeeName, decision, rejectReason = null) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  let subject = decision === "Approved" 
    ? "✅ Your Leave Request is Approved" 
    : "❌ Your Leave Request is Rejected";

  let reasonText = decision === "Rejected" && rejectReason 
    ? `<p style="color:#d9534f; font-size:15px;"><strong>Reason:</strong> ${rejectReason}</p>` 
    : "";

  const mailOptions = {
    from: `"AI Recruiter HR" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; background: #f4f7fb; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          
          <h2 style="text-align: center; color: #2d89ef; margin-bottom: 10px;">AI Recruiter</h2>
          <hr style="border: none; height: 2px; background: #2d89ef; margin: 15px 0;">

          <h3 style="color: #333;">Hello ${employeeName},</h3>
          <p style="font-size: 15px; color: #555;">
            Your recent leave request has been 
            <strong style="color:${decision === "Approved" ? "green" : "red"};">
              ${decision}
            </strong>.
          </p>
          
          ${reasonText}

          <p style="font-size: 14px; color: #444; margin-top: 20px;">
            If you have any concerns, please contact the HR team.
          </p>

          <hr style="border: none; height: 1px; background: #ddd; margin: 20px 0;">

          <p style="font-size: 13px; text-align: center; color: #888;">
            Regards,<br/>
            <strong>HR Department</strong><br/>
            AI Recruiter
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};



const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendInviteEmail = async (to, link, company, role) => {
  const transporter = createTransporter();
  const mailOptions = {
    from: `"AI Recruiter" <${process.env.EMAIL_USER}>`,
    to,
    subject: `📩 ${company} - Registration Invite (${role})`,
    html: `
      <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; padding: 25px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          <h2 style="text-align: center; color: #2d89ef; margin-bottom: 10px;">🤖 ${company}</h2>
          <p>Hello,</p>
          <p>Please use the link below to complete your <strong>${role} registration</strong>:</p>
          <div style="text-align:center; margin:20px 0;">
            <a href="${link}" target="_blank" style="background: #2d89ef; color: white; padding: 12px 25px; text-decoration:none; border-radius:8px;">Open Registration</a>
          </div>
          <p style="text-align:center;">Or copy this link: <br/><a href="${link}">${link}</a></p>
          <p style="font-size:13px;color:#666;margin-top:16px;">Note: link is valid for ${process.env.INVITE_EXPIRY_DAYS || 30} days and only usable once.</p>
          <hr/>
          <p style="font-size:12px;color:#888;text-align:center;">Regards,<br/>${company} HR</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};