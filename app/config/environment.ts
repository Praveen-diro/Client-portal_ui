interface BaseUrl {
  stage1baseurl: string;
  stage2baseurl: string;
  prodbaseurl: string;
  stage1nodeurl: string;
  stage2nodeurl: string;
}

interface Environment {
  env: string;
  clientPortalUrl: string;
  download: string;
  userlist: string;
  verifykyc: string;
  signup: string;
  forgot: string;
  login: string;
  updatepassword: string;
  resetpassword: string;
  diroStatus: string;
  orguserdetails: string;
  adminmx: string;
  admintoken: string;
  mainurl: string;
  rawmxcreation: string;
  swaggerlink: string;
  infoverifier: string;
  resendemail: string;
  termsofservice: string;
  privacypolicy: string;
  orglist: string;
  scoringchart: string;
  orguserlist: string;
  orguserlistwithoutorg: string;
  sendsmsfororg: string;
  checkuserexist: string;
  recentactivities: string;
  orgaccount: string;
  transactions: string;
  ocrextract: string;
  translatepdf: string;
  addWorker: string;
  deleteWorker: string;
  updateWorker: string;
  ownerTransfer: string;
  getWorker: string;
  getWorkersList: string;
  viewkycPageURL: string;
  pdfPageUrl: string;
  seeCoverage: string;
  worldmapurl: string;
  uploadverification_link: string;
  verification_link: string;
  iframe_link: string;
  verification_link_new: string;
  accesstoken: string;
  feedbackUrl: string;
  get_lastclicked_link: string;
  deletesession: string;
  getmasterfields: string;
  pdftojson: string;
  extractTransaction: string;
  redoTransactionDoc: string;
  getalluserdata: string;
  customerreminder: boolean;
  getemailreminder: string;
  removebg: string;
  removeBgApiKey: string;
  getS3bucket: string;
  searchS3bucket: string;
  testEmailReminder: string;
  Skey: string;
  recaptcha: string;
  sentryDSN: string;
  fusionAuth: string;
  fusionAuthKey: string;
  consoleLog: boolean;
  googleLogo: string;
  blacklisttoken: string;
  deleteblacklisttoken: string;
  aplicationFusionauthId: string;
  fusionAuthApiKey: string;
  expireRefreshToken: string;
  saveOrgData: string;
  accesstokenUrl: string;
  switchServer: string;
  stagingenv?: string;
  twoFactorLogin: string;
  sendLoginOtp: string;
  qrCode: string;
  sendOtp: string;
  enableTwoFactor: string;
  expireRefreshtoken: string;
  twofactorAutomatedOtp: string;
  generateSecretToken: string;
  bypassEmails: string[];
  getAutoNavData: string;
  getSingleRequestCallback: string;
  allowedOrigin: string;
  emailAccount: string;
  emailPassword: string;
  emailPort: string;
  emailHost: string;
  upload_widget_CSS_CDN: string;
  upload_widget_JS_CDN: string;
  capture_widget_CSS_CDN: string;
  capture_widget_JS_CDN: string;
  varificationSwaggerLink: string;
  varificationSwaggerLinkBeta: string;
  getlanguage: string;
  checkexistance: string;
  createconsentrawmx: string;
  updateorganization: string;
  rawmxbyorg: string;
  verifiedcountrylist: string;
  selfinvite_url: string;
  orginfo: string;
  demo_bank_info: string;
  bank_user_info: string;
  bank_invite_user_email: string;
  sendotp: string;
  recognitionlanguage: string;
  updatefile: string;
  orgdetails: string;
  callbacklogs: string;
  selectlanguage: string;
  countryinfo: string;
  updatecountrydata: string;
  addcomment: string;
  showcomment: string;
  banklinks: string;
  addbanklinks: string;
  deletebanklinks: string;
  editbanklinks: string;
  getcallslots: string;
  addcallslot: string;
  delete_call_slot: string;
  add_link: string;
  update_link: string;
  delete_link: string;
  registeruser: string;
  upload_link_logo: string;
  userwithorg: string;
  zip_upload: string;
  boards_list: string;
  zip_update: string;
  downloadboard: string;
  btn_data: string;
  btn_list: string;
  update_btn: string;
  country_with_states: string;
  worldmap: string;
  getdoc: string;
  deletebutton: string;
  defaultorgapikey: string;
  bankverification: string;
  downloadmht: string;
  request_demo: string;
  getbtndata: string;
  banklist: string;
  invite: string;
  getplan: string;
  chargecard: string;
  striperedirect: string;
  returnurl: string;
  stripekey: string;
  getplaninfo: string;
  updatesubscription: string;
  usagecount: string;
  getverificationlink: string;
  sessionstats: string;
  getVerifiedCountry: string;
  btnstatus: string;
  linklist: string;
  getverifiedlink: string;
  createsource: string;
  updatesource: string;
  deletesource: string;
  beta: string;
  fulltextsearch: string;
  documentjson: string;
  tagfields: string;
}

const baseurl: BaseUrl = {
  stage1baseurl: "https://stage.diro.live/Zuul-1.0/",
  stage2baseurl: "https://stage2.diro.live/Zuul-1.0/",
  prodbaseurl: "https://prod.dirolabs.com/Zuul-1.0/",
  stage1nodeurl: "https://api1.diro.live/",
  stage2nodeurl: "https://api2.diro.live/",
};

const stage2: Environment = {
  env: "stage2",
  clientPortalUrl: "https://client2.diro.live",
  download: baseurl.stage2baseurl + "uploadKyc-2.0/downloadDoucment",
  userlist: baseurl.stage2baseurl + "Admin-2.0/getUserList",
  verifykyc: baseurl.stage2baseurl + "organization-2.0/verifiedkycdoc",
  signup: baseurl.stage2baseurl + "organization-2.0/signup",
  forgot: baseurl.stage2baseurl + "organization-2.0/forgetPassword",
  login: baseurl.stage2baseurl + "organization-2.0/login",
  updatepassword: baseurl.stage2baseurl + "organization-2.0/updatePassword",
  resetpassword: baseurl.stage2baseurl + "organization-2.0/resetpassword",
  diroStatus: baseurl.stage2baseurl + "organization-2.0/dirostatus",
  orguserdetails: baseurl.stage2baseurl + "organization-2.0/get_orguser_details",
  adminmx: "918527843794",
  admintoken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI5MTg1Mjc4NDM3OTQifQ.kQjW-YuJ1drxQti8-V5hsCYkVgGVS7HqM8K4d934_uc",
  mainurl: "https://diro.live/client/",
  rawmxcreation: baseurl.stage2baseurl + "organization-2.0/rawMxCreation",
  swaggerlink: "https://diro.live/kycdoc/",
  infoverifier: baseurl.stage2baseurl + "htmlcrawler-2.0/infoverifier",
  resendemail: baseurl.stage2baseurl + "organization-2.0/resend",
  termsofservice: "https://diro.live/user/termsOfService",
  privacypolicy: "https://diro.live/user/privacyPolicy",
  orglist: baseurl.stage2baseurl + "Admin-2.0/getorglist",
  scoringchart: baseurl.stage2baseurl + "Admin-2.0/getScoreTable",
  orguserlist: baseurl.stage2baseurl + "Admin-2.0/orguserdetails",
  orguserlistwithoutorg: baseurl.stage2baseurl + "Admin-2.0/getallorgdata",
  sendsmsfororg: baseurl.stage2baseurl + "organization-2.0/sendsmsfororg",
  checkuserexist: baseurl.stage2baseurl + "organization-2.0/ismobileexist",
  recentactivities: baseurl.stage2baseurl + "organization-2.0/recentactivity",
  orgaccount: baseurl.stage2baseurl + "Account-2.0/orgaccount",
  transactions: baseurl.stage2baseurl + "Account-2.0/gettransaction",
  ocrextract: baseurl.stage2baseurl + "organization-2.0/translatemhtml",
  translatepdf: baseurl.stage2baseurl + "organization-2.0/translatepdf",
  getlanguage: baseurl.stage2baseurl + "uploadKyc-2.0/getlanguage",
  checkexistance: baseurl.stage2baseurl + "organization-2.0/checkexistance",
  createconsentrawmx: baseurl.stage2baseurl + "organization-2.0/createconsentrawmx",
  updateorganization: baseurl.stage2baseurl + "organization-2.0/updateorganization",
  rawmxbyorg: baseurl.stage2baseurl + "organization-2.0/rawmxbyorg",
  verifiedcountrylist: baseurl.stage2baseurl + "VerifiedCountryDetail-2.0/getVerifiedCountry",
  selfinvite_url: "https://diro.live/user",
  orginfo: baseurl.stage2baseurl + "organization-2.0/getlogo",
  demo_bank_info: baseurl.stage2baseurl + "User-2.0/usrbankdemoinfo",
  bank_user_info: baseurl.stage2baseurl + "User-2.0/usrbankinfo",
  bank_invite_user_email: "https://client.diro.live/#/invitation",
  sendotp: baseurl.stage2baseurl + "User-2.0/sendOtp",
  recognitionlanguage: baseurl.stage2baseurl + "uploadKyc-2.0/getRecoginition",
  updatefile: baseurl.stage2baseurl + "Admin-2.0/updatefile",
  orgdetails: baseurl.stage2baseurl + "organization-2.0/orgdetails",
  callbacklogs: baseurl.stage2baseurl + "organization-2.0/callbacklog",
  selectlanguage: baseurl.stage2baseurl + "IdMaster-2.0/getcountryname?languages=",
  countryinfo: baseurl.stage2baseurl + "IdMaster-2.0/idInfo",
  updatecountrydata: baseurl.stage2baseurl + "IdMaster-2.0/updatedoc",
  addcomment: baseurl.stage2baseurl + "IdMaster-2.0/addComment",
  showcomment: baseurl.stage2baseurl + "IdMaster-2.0/showComments",
  banklinks: baseurl.stage2baseurl + "IdMaster-2.0/showbanklinks",
  addbanklinks: baseurl.stage2baseurl + "IdMaster-2.0/addbanklink",
  deletebanklinks: baseurl.stage2baseurl + "IdMaster-2.0/deletebanklink",
  editbanklinks: baseurl.stage2baseurl + "IdMaster-2.0/updatebanklink",
  getcallslots: baseurl.stage2baseurl + "Admin-2.0/getcallslots",
  addcallslot: baseurl.stage2baseurl + "Admin-2.0/addslots",
  delete_call_slot: baseurl.stage2baseurl + "Admin-2.0/deleteslots",
  add_link: baseurl.stage2baseurl + "IdMaster-2.0/addlink",
  update_link: baseurl.stage2baseurl + "IdMaster-2.0/updatelink",
  delete_link: baseurl.stage2baseurl + "IdMaster-2.0/deletelink",
  registeruser: baseurl.stage2baseurl + "Admin-2.0/registeruserinfo",
  upload_link_logo: baseurl.stage2baseurl + "Image-2.0/postImage",
  userwithorg: baseurl.stage2baseurl + "Admin-2.0/userwithorg",
  zip_upload: baseurl.stage2baseurl + "boards-2.0/create",
  boards_list: baseurl.stage2baseurl + "boards-2.0/boardlist",
  zip_update: baseurl.stage2baseurl + "boards-2.0/update",
  downloadboard: baseurl.stage2baseurl + "boards-2.0/downloadboard",
  btn_data: baseurl.stage2baseurl + "boards-2.0/createbutton",
  btn_list: baseurl.stage2baseurl + "boards-2.0/buttonlist",
  update_btn: baseurl.stage2baseurl + "boards-2.0/updatebutton",
  country_with_states: baseurl.stage2baseurl + "IdMaster-2.0/countrywithstates",
  worldmap: baseurl.stage2baseurl + "IdMaster-2.0/worldmap",
  getdoc: baseurl.stage2baseurl + "barcode-2.0/getprotaldocument/",
  deletebutton: baseurl.stage2baseurl + "boards-2.0/deletebutton",
  defaultorgapikey: "50015572742fd0470ec30ac9c9477090f",
  bankverification: "https://bankverify.diro.live/",
  downloadmht: baseurl.stage2baseurl + "uploadKyc-2.0/downloadmhtfile",
  request_demo: "https://buttons.diro.live/",
  getbtndata: baseurl.stage2baseurl + "boards-2.0/getbutton",
  banklist: baseurl.stage2baseurl + "IdMaster-2.0/banklinkscategorywise",
  invite: baseurl.stage2baseurl + "organization-2.0/requesteduser",
  getplan: baseurl.stage2baseurl + "Account-2.0/getplan",
  chargecard: baseurl.stage2baseurl + "Account-2.0/chargecard",
  striperedirect: baseurl.stage2baseurl + "Account-2.0/redirect",
  returnurl: "https://client.diro.live/#/manageaccount",
  stripekey: "pk_live_U9USyVzQsNd4nrYvNv8n5nFp",
  getplaninfo: baseurl.stage2baseurl + "Account-2.0/getplaninfo",
  updatesubscription: baseurl.stage2baseurl + "Account-2.0/updatesubscription",
  usagecount: baseurl.stage2baseurl + "Account-2.0/usagecount",
  getverificationlink: baseurl.stage2baseurl + "organization-2.0/getverificationlink",
  sessionstats: baseurl.stage2baseurl + "organization-2.0/sessionstats",
  getVerifiedCountry: baseurl.stage2baseurl + "VerifiedCountryDetail-2.0/getVerifiedCountry",
  btnstatus: baseurl.stage2baseurl + "organization-2.0/buttonstats",
  linklist: baseurl.stage2baseurl + "IdMaster-2.0/link/readall",
  getverifiedlink: baseurl.stage2baseurl + "organization-2.0/getverificationlink",
  createsource: baseurl.stage2baseurl + "IdMaster-2.0/link/create",
  updatesource: baseurl.stage2baseurl + "IdMaster-2.0/link/update",
  deletesource: baseurl.stage2baseurl + "IdMaster-2.0/link/delete",
  beta: "Beta",
  fulltextsearch: baseurl.stage2baseurl + "fulltextsearch-2.0/searchlinks",
  documentjson: baseurl.stage2baseurl + "uploadKyc-2.0/documentjson",
  tagfields: baseurl.stage2baseurl + "uploadKyc-2.0/tagfields",
  addWorker: baseurl.stage2baseurl + "organization-2.0/addworker",
  deleteWorker: baseurl.stage2baseurl + "organization-2.0/deleteworker",
  updateWorker: baseurl.stage2baseurl + "organization-2.0/updateworker",
  ownerTransfer: baseurl.stage2baseurl + "organization-2.0/makeowner",
  getWorker: baseurl.stage2baseurl + "organization-2.0/worker",
  getWorkersList: baseurl.stage2baseurl + "organization-2.0/workers",
  viewkycPageURL: "https://client.diro.live/#/viewKycReporting/",
  pdfPageUrl: "https://client.diro.live/#/viewContact/",
  seeCoverage: "https://diro.live/see-coverage/",
  worldmapurl: "https://client.diro.live/#/mapview/",
  verification_link: "https://verification.diro.live/?buttonid=",
  verification_link_new: "https://session.diro.live/server/#/client/?buttonid=",
  iframe_link: "https://verification.diro.live/?ibuttonid=",
  accesstoken: baseurl.stage2baseurl + "organization-2.0/accesstoken",
  feedbackUrl: baseurl.stage2baseurl + "User-2.0/feedback",
  get_lastclicked_link: baseurl.stage2baseurl + "User-2.0/getlastclickedlink",
  deletesession: baseurl.stage2baseurl + "uploadKyc-2.0/deletedocument",
  getmasterfields: baseurl.stage2baseurl + "Admin-2.0/getmasterfields",
  pdftojson: baseurl.stage2baseurl + "HI-2.0/pdf/pdftojson",
  extractTransaction: "https://api2.diro.live/textract/extractTransaction",
  redoTransactionDoc: "https://api2.diro.live/textract/redoTransactionDoc",
  getalluserdata: "https://api2.diro.live/ube/get-all-data",
  customerreminder: true,
  getemailreminder: "https://api2.diro.live/emailReminder/getemailreminder",
  removebg: "https://api.remove.bg/v1.0/removebg",
  removeBgApiKey: "CwVAzNbhcy3uJChuwQYyY1de",
  getS3bucket: "https://list-bucket.diro.me/api/get-bucket-data",
  searchS3bucket: "https://list-bucket.diro.me/api/search-bucket-data",
  testEmailReminder: "https://stage2.diro.live/Zuul-1.0/uploadKyc-2.0/setcustomerremindermail",
  Skey: "6LfMOrwlAAAAANapKjS4i9wOe067YD9s3gcOTSbM",
  recaptcha: "https://api2.diro.live/recaptcha/",
  sentryDSN: "https://57a0371f3cc74c059f48d93a0a3aafcc@o1042621.ingest.sentry.io/4505016759746560",
  fusionAuth: "https://fauth2.diro.live",
  fusionAuthKey: "r0fzHWjCvWGsx-obEc9q-uv7Vo_hXBT4wAk5JesBpmzVDzHYTAEZJD9x",
  consoleLog: false,
  googleLogo: "https://verificationlink.diro.live/icons/logo-google.svg",
  blacklisttoken: baseurl.stage2baseurl + "organization-2.0/blacklisttoken",
  deleteblacklisttoken: baseurl.stage2baseurl + "organization-2.0/deleteaccesstoken",
  aplicationFusionauthId: "9cb662c8-0e64-41eb-b8cc-dd8244d12e02",
  fusionAuthApiKey: "r0fzHWjCvWGsx-obEc9q-uv7Vo_hXBT4wAk5JesBpmzVDzHYTAEZJD9x",
  expireRefreshToken: "https://fauth2.diro.live/api/jwt/refresh",
  saveOrgData: baseurl.stage2baseurl + "organization-2.0/saveOrgData",
  accesstokenUrl: baseurl.stage2baseurl + "organization-2.0/accesstoken",
  switchServer: baseurl.stage2baseurl + "organization-2.0/switchServer",
  stagingenv: "stage2",
  twoFactorLogin: baseurl.stage2baseurl + "organization-2.0/twoFactorLogin",
  sendLoginOtp: baseurl.stage2nodeurl + "org/api/sendLoginOtp",
  qrCode: baseurl.stage2nodeurl + "org/api/generateQR",
  sendOtp: baseurl.stage2nodeurl + "org/api/sendOTP",
  enableTwoFactor: baseurl.stage2nodeurl + "org/api/enabletwofactor",
  expireRefreshtoken: baseurl.stage2nodeurl + "org/api/expireRefreshtoken",
  twofactorAutomatedOtp: baseurl.stage2nodeurl + "org/api/twofactorAutomatedOtp",
  generateSecretToken: baseurl.stage2baseurl + "organization-2.0/generatesecrettoken",
  bypassEmails: ["deepak@diro.io", "praveen@diro.io"],
  getAutoNavData: "https://api2.diro.live/auto_nav/getAutoNavData",
  getSingleRequestCallback: "https://stage2.diro.live/Zuul-1.0/boards-2.0/sendcallback",
  allowedOrigin: "https://client2.diro.live",
  emailAccount: "guest@diro.io",
  emailPassword: "9pH6LZ4YwbSfj3dc",
  emailPort: "587",
  emailHost: "smtp-relay.sendinblue.com",
  upload_widget_CSS_CDN: "https://smartupload.diro.io/widgets-stage2/diro.css",
  upload_widget_JS_CDN: "https://smartupload.diro.io/widgets-stage2/diro.js",
  capture_widget_CSS_CDN: "https://directlinkwidget-d0awedeyche6e7bu.z03.azurefd.net/directlink-staging/stylesSelectLink.css",
  capture_widget_JS_CDN: "https://directlinkwidget-d0awedeyche6e7bu.z03.azurefd.net/directlink-staging/diroWidgetSelectLink.js",
  varificationSwaggerLink: "/betav3",
  varificationSwaggerLinkBeta: "/beta",
  uploadverification_link: "https://verify.diro.live/?buttonid=",
};

const stage1: Environment = {
  env: "stage1",
  clientPortalUrl: "https://client1.diro.live",
  download: baseurl.stage1baseurl + "uploadKyc-2.0/downloadDoucment",
  userlist: baseurl.stage1baseurl + "Admin-2.0/getUserList",
  verifykyc: baseurl.stage1baseurl + "organization-2.0/verifiedkycdoc",
  signup: baseurl.stage1baseurl + "organization-2.0/signup",
  forgot: baseurl.stage1baseurl + "organization-2.0/forgetPassword",
  login: baseurl.stage1baseurl + "organization-2.0/login",
  updatepassword: baseurl.stage1baseurl + "organization-2.0/updatePassword",
  resetpassword: baseurl.stage1baseurl + "organization-2.0/resetpassword",
  diroStatus: baseurl.stage1baseurl + "organization-2.0/dirostatus",
  orguserdetails: baseurl.stage1baseurl + "organization-2.0/get_orguser_details",
  adminmx: "918527843794",
  admintoken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI5MTg1Mjc4NDM3OTQifQ.kQjW-YuJ1drxQti8-V5hsCYkVgGVS7HqM8K4d934_uc",
  mainurl: "https://diro.io/client/",
  rawmxcreation: baseurl.stage1baseurl + "organization-2.0/rawMxCreation",
  swaggerlink: "https://diro.io/kycdoc/",
  infoverifier: baseurl.stage1baseurl + "htmlcrawler-2.0/infoverifier",
  resendemail: baseurl.stage1baseurl + "organization-2.0/resend",
  termsofservice: "https://diro.io/user/termsOfService",
  privacypolicy: "https://diro.io/user/privacyPolicy",
  orglist: baseurl.stage1baseurl + "Admin-2.0/getorglist",
  scoringchart: baseurl.stage1baseurl + "Admin-2.0/getScoreTable",
  orguserlist: baseurl.stage1baseurl + "Admin-2.0/orguserdetails",
  orguserlistwithoutorg: baseurl.stage1baseurl + "Admin-2.0/getallorgdata",
  sendsmsfororg: baseurl.stage1baseurl + "organization-2.0/sendsmsfororg",
  checkuserexist: baseurl.stage1baseurl + "organization-2.0/ismobileexist",
  recentactivities: baseurl.stage1baseurl + "organization-2.0/recentactivity",
  orgaccount: baseurl.stage1baseurl + "Account-2.0/orgaccount",
  transactions: baseurl.stage1baseurl + "Account-2.0/gettransaction",
  ocrextract: baseurl.stage1baseurl + "organization-2.0/translatemhtml",
  translatepdf: baseurl.stage1baseurl + "organization-2.0/translatepdf",
  getlanguage: baseurl.stage1baseurl + "uploadKyc-2.0/getlanguage",
  checkexistance: baseurl.stage1baseurl + "organization-2.0/checkexistance",
  createconsentrawmx: baseurl.stage1baseurl + "organization-2.0/createconsentrawmx",
  updateorganization: baseurl.stage1baseurl + "organization-2.0/updateorganization",
  rawmxbyorg: baseurl.stage1baseurl + "organization-2.0/rawmxbyorg",
  verifiedcountrylist: baseurl.stage1baseurl + "VerifiedCountryDetail-2.0/getVerifiedCountry",
  selfinvite_url: "https://diro.io/user",
  orginfo: baseurl.stage1baseurl + "organization-2.0/getlogo",
  demo_bank_info: baseurl.stage1baseurl + "User-2.0/usrbankdemoinfo",
  bank_user_info: baseurl.stage1baseurl + "User-2.0/usrbankinfo",
  bank_invite_user_email: "https://stage1client.diro.live/#/invitation",
  sendotp: baseurl.stage1baseurl + "User-2.0/sendOtp",
  recognitionlanguage: baseurl.stage1baseurl + "uploadKyc-2.0/getRecoginition",
  updatefile: baseurl.stage1baseurl + "Admin-2.0/updatefile",
  orgdetails: baseurl.stage1baseurl + "organization-2.0/orgdetails",
  callbacklogs: baseurl.stage1baseurl + "organization-2.0/callbacklog",
  selectlanguage: baseurl.stage1baseurl + "IdMaster-2.0/getcountryname?languages=",
  countryinfo: baseurl.stage1baseurl + "IdMaster-2.0/idInfo",
  updatecountrydata: baseurl.stage1baseurl + "IdMaster-2.0/updatedoc",
  addcomment: baseurl.stage1baseurl + "IdMaster-2.0/addComment",
  showcomment: baseurl.stage1baseurl + "IdMaster-2.0/showComments",
  banklinks: baseurl.stage1baseurl + "IdMaster-2.0/showbanklinks",
  addbanklinks: baseurl.stage1baseurl + "IdMaster-2.0/addbanklink",
  deletebanklinks: baseurl.stage1baseurl + "IdMaster-2.0/deletebanklink",
  editbanklinks: baseurl.stage1baseurl + "IdMaster-2.0/updatebanklink",
  getcallslots: baseurl.stage1baseurl + "Admin-2.0/getcallslots",
  addcallslot: baseurl.stage1baseurl + "Admin-2.0/addslots",
  delete_call_slot: baseurl.stage1baseurl + "Admin-2.0/deleteslots",
  add_link: baseurl.stage1baseurl + "IdMaster-2.0/addlink",
  update_link: baseurl.stage1baseurl + "IdMaster-2.0/updatelink",
  delete_link: baseurl.stage1baseurl + "IdMaster-2.0/deletelink",
  registeruser: baseurl.stage1baseurl + "Admin-2.0/registeruserinfo",
  upload_link_logo: baseurl.stage1baseurl + "Image-2.0/postImage",
  userwithorg: baseurl.stage1baseurl + "Admin-2.0/userwithorg",
  zip_upload: baseurl.stage1baseurl + "boards-2.0/create",
  boards_list: baseurl.stage1baseurl + "boards-2.0/boardlist",
  zip_update: baseurl.stage1baseurl + "boards-2.0/update",
  downloadboard: baseurl.stage1baseurl + "boards-2.0/downloadboard",
  btn_data: baseurl.stage1baseurl + "boards-2.0/createbutton",
  btn_list: baseurl.stage1baseurl + "boards-2.0/buttonlist",
  update_btn: baseurl.stage1baseurl + "boards-2.0/updatebutton",
  country_with_states: baseurl.stage1baseurl + "IdMaster-2.0/countrywithstates",
  worldmap: baseurl.stage1baseurl + "IdMaster-2.0/worldmap",
  getdoc: baseurl.stage1baseurl + "barcode-2.0/getprotaldocument/",
  deletebutton: baseurl.stage1baseurl + "boards-2.0/deletebutton",
  defaultorgapikey: "50015572742fd0470ec30ac9c9477090f",
  bankverification: "https://diro.io/bankverification/",
  downloadmht: baseurl.stage1baseurl + "uploadKyc-2.0/downloadmhtfile",
  request_demo: "https://stage1buttons.diro.live/",
  getbtndata: baseurl.stage1baseurl + "boards-2.0/getbutton",
  banklist: baseurl.stage1baseurl + "IdMaster-2.0/banklinkscategorywise",
  invite: baseurl.stage1baseurl + "organization-2.0/requesteduser",
  getplan: baseurl.stage1baseurl + "Account-2.0/getplan",
  chargecard: baseurl.stage1baseurl + "Account-2.0/chargecard",
  striperedirect: baseurl.stage1baseurl + "Account-2.0/redirect",
  returnurl: "https://diro.io/client/#/manageaccount",
  stripekey: "pk_live_U9USyVzQsNd4nrYvNv8n5nFp",
  getplaninfo: baseurl.stage1baseurl + "Account-2.0/getplaninfo",
  updatesubscription: baseurl.stage1baseurl + "Account-2.0/updatesubscription",
  usagecount: baseurl.stage1baseurl + "Account-2.0/usagecount",
  getverificationlink: baseurl.stage1baseurl + "organization-2.0/getverificationlink",
  sessionstats: baseurl.stage1baseurl + "organization-2.0/sessionstats",
  getVerifiedCountry: baseurl.stage1baseurl + "VerifiedCountryDetail-2.0/getVerifiedCountry",
  btnstatus: baseurl.stage1baseurl + "organization-2.0/buttonstats",
  linklist: baseurl.stage1baseurl + "IdMaster-2.0/link/readall",
  createsource: baseurl.stage1baseurl + "IdMaster-2.0/link/create",
  updatesource: baseurl.stage1baseurl + "IdMaster-2.0/link/update",
  deletesource: baseurl.stage1baseurl + "IdMaster-2.0/link/delete",
  beta: "",
  getverifiedlink: baseurl.stage1baseurl + "organization-2.0/getverificationlink",
  fulltextsearch: baseurl.stage1baseurl + "fulltextsearch-2.0/searchlinks",
  addWorker: baseurl.stage1baseurl + "organization-2.0/addworker",
  deleteWorker: baseurl.stage1baseurl + "organization-2.0/deleteworker",
  updateWorker: baseurl.stage1baseurl + "organization-2.0/updateworker",
  getWorker: baseurl.stage1baseurl + "organization-2.0/worker",
  getWorkersList: baseurl.stage1baseurl + "organization-2.0/workers",
  viewkycPageURL: "https://stage1client.diro.live/#/viewKycReporting/",
  pdfPageUrl: "https://stage1client.diro.live/#/viewContact/",
  seeCoverage: "https://diro.live/see-coverage/",
  worldmapurl: "https://stage1client.diro.live/#/mapview/",
  verification_link: "https://nocode.diro.me/verification/?buttonid=",
  verification_link_new: "https://session1.diro.live/server/#/client/?buttonid=",
  iframe_link: "https://verification1.diro.live/?ibuttonid=",
  accesstoken: baseurl.stage1baseurl + "organization-2.0/accesstoken",
  feedbackUrl: baseurl.stage1baseurl + "User-2.0/feedback",
  get_lastclicked_link: baseurl.stage1baseurl + "User-2.0/getlastclickedlink",
  deletesession: baseurl.stage1baseurl + "uploadKyc-2.0/deletedocument",
  getmasterfields: baseurl.stage2baseurl + "Admin-2.0/getmasterfields",
  pdftojson: baseurl.stage1baseurl + "HI-2.0/pdf/pdftojson",
  getalluserdata: "https://usermgn.diro.live/get-all-data",
  customerreminder: true,
  getemailreminder: "https://api1.diro.live/emailReminder/getemailreminder",
  testEmailReminder: "https://stage.diro.live/Zuul-1.0/uploadKyc-2.0/setcustomerremindermail",
  Skey: "6LfMOrwlAAAAANapKjS4i9wOe067YD9s3gcOTSbM",
  recaptcha: "https://api1.diro.live/recaptcha/",
  sentryDSN: "https://911505faffdb4b389a347914a0f0f0c8@o4505041099030528.ingest.sentry.io/4505045968093184",
  fusionAuth: "http://fauth1.diro.live:9011",
  fusionAuthKey: "l6zwuy71MbjlnJH-NRUGCbI5mOgZPVwNHFDXU_efQUv43fKucd_a85p_",
  consoleLog: true,
  googleLogo: "https://stage1verificationlink.diro.live/icons/logo-google.svg",
  blacklisttoken: baseurl.stage1baseurl + "organization-2.0/blacklisttoken",
  deleteblacklisttoken: baseurl.stage1baseurl + "organization-2.0/deleteaccesstoken",
  aplicationFusionauthId: "9cb662c8-0e64-41eb-b8cc-dd8244d12e02",
  fusionAuthApiKey: "r0fzHWjCvWGsx-obEc9q-uv7Vo_hXBT4wAk5JesBpmzVDzHYTAEZJD9x",
  expireRefreshToken: "https://fauth1.diro.live/api/jwt/refresh",
  saveOrgData: baseurl.stage1baseurl + "organization-2.0/saveOrgData",
  accesstokenUrl: baseurl.stage1baseurl + "organization-2.0/accesstoken",
  switchServer: baseurl.stage1baseurl + "organization-2.0/switchServer",
  twoFactorLogin: baseurl.stage1baseurl + "organization-2.0/twoFactorLogin",
  sendLoginOtp: baseurl.stage1nodeurl + "org/api/sendLoginOtp",
  qrCode: baseurl.stage1nodeurl + "org/api/generateQR",
  sendOtp: baseurl.stage1nodeurl + "org/api/sendOTP",
  enableTwoFactor: baseurl.stage1nodeurl + "org/api/enabletwofactor",
  expireRefreshtoken: baseurl.stage1nodeurl + "org/api/expireRefreshtoken",
  generateSecretToken: baseurl.stage1baseurl + "organization-2.0/generatesecrettoken",
  bypassEmails: ["deepak@diro.io", "praveen@diro.io", "mamta@diro.io"],
  twofactorAutomatedOtp: baseurl.stage1nodeurl + "org/api/twofactorAutomatedOtp",
  getSingleRequestCallback: "https://stage.diro.live/Zuul-1.0/boards-2.0/sendcallback",
  allowedOrigin: "https://client1.diro.live",
  emailAccount: "guest@diro.io",
  emailPassword: "9pH6LZ4YwbSfj3dc",
  emailPort: "587",
  emailHost: "smtp-relay.sendinblue.com",
  upload_widget_CSS_CDN: "https://smartupload.diro.io/widgets-stage1/diro.css",
  upload_widget_JS_CDN: "https://smartupload.diro.io/widgets-stage1/diro.js",
  capture_widget_CSS_CDN: "https://directlinkwidget-d0awedeyche6e7bu.z03.azurefd.net/directlink-staging/stylesSelectLink.css",
  capture_widget_JS_CDN: "https://directlinkwidget-d0awedeyche6e7bu.z03.azurefd.net/directlink-staging/diroWidgetSelectLink.js",
  varificationSwaggerLink: "/betav3",
  varificationSwaggerLinkBeta: "/beta",
  extractTransaction: "https://api1.diro.live/textract/extractTransaction",
  redoTransactionDoc: "https://api1.diro.live/textract/redoTransactionDoc",
  removebg: "https://api.remove.bg/v1.0/removebg",
  removeBgApiKey: "CwVAzNbhcy3uJChuwQYyY1de",
  getS3bucket: "https://list-bucket.diro.me/api/get-bucket-data",
  searchS3bucket: "https://list-bucket.diro.me/api/search-bucket-data",
  documentjson: baseurl.stage1baseurl + "uploadKyc-2.0/documentjson",
  tagfields: baseurl.stage1baseurl + "uploadKyc-2.0/tagfields",
  uploadverification_link: "https://verify.diro.live/?buttonid=",
  getAutoNavData: "https://api1.diro.live/auto_nav/getAutoNavData",
  ownerTransfer: baseurl.stage1baseurl + "organization-2.0/makeowner",
};

const prodeu: Environment = {
  env: "prodeu",
  clientPortalUrl: "https://client.diro.io",
  download: baseurl.prodbaseurl + "uploadKyc-2.0/downloadDoucment",
  userlist: baseurl.prodbaseurl + "Admin-2.0/getUserList",
  verifykyc: baseurl.prodbaseurl + "organization-2.0/verifiedkycdoc",
  signup: baseurl.prodbaseurl + "organization-2.0/signup",
  forgot: baseurl.prodbaseurl + "organization-2.0/forgetPassword",
  login: baseurl.prodbaseurl + "organization-2.0/login",
  updatepassword: baseurl.prodbaseurl + "organization-2.0/updatePassword",
  resetpassword: baseurl.prodbaseurl + "organization-2.0/resetpassword",
  diroStatus: baseurl.prodbaseurl + "organization-2.0/dirostatus",
  orguserdetails: baseurl.prodbaseurl + "organization-2.0/get_orguser_details",
  adminmx: "918527843794",
  admintoken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI5MTg1Mjc4NDM3OTQifQ.kQjW-YuJ1drxQti8-V5hsCYkVgGVS7HqM8K4d934_uc",
  mainurl: "https://diro.io/client/",
  rawmxcreation: baseurl.prodbaseurl + "organization-2.0/rawMxCreation",
  swaggerlink: "https://diro.io/kycdoc/",
  infoverifier: baseurl.prodbaseurl + "htmlcrawler-2.0/infoverifier",
  resendemail: baseurl.prodbaseurl + "organization-2.0/resend",
  termsofservice: "https://diro.io/user/termsOfService",
  privacypolicy: "https://diro.io/user/privacyPolicy",
  orglist: baseurl.prodbaseurl + "Admin-2.0/getorglist",
  scoringchart: baseurl.prodbaseurl + "Admin-2.0/getScoreTable",
  orguserlist: baseurl.prodbaseurl + "Admin-2.0/orguserdetails",
  orguserlistwithoutorg: baseurl.prodbaseurl + "Admin-2.0/getallorgdata",
  sendsmsfororg: baseurl.prodbaseurl + "organization-2.0/sendsmsfororg",
  checkuserexist: baseurl.prodbaseurl + "organization-2.0/ismobileexist",
  recentactivities: baseurl.prodbaseurl + "organization-2.0/recentactivity",
  orgaccount: baseurl.prodbaseurl + "Account-2.0/orgaccount",
  transactions: baseurl.prodbaseurl + "Account-2.0/gettransaction",
  ocrextract: baseurl.prodbaseurl + "organization-2.0/translatemhtml",
  translatepdf: baseurl.prodbaseurl + "organization-2.0/translatepdf",
  getlanguage: baseurl.prodbaseurl + "uploadKyc-2.0/getlanguage",
  checkexistance: baseurl.prodbaseurl + "organization-2.0/checkexistance",
  createconsentrawmx: baseurl.prodbaseurl + "organization-2.0/createconsentrawmx",
  updateorganization: baseurl.prodbaseurl + "organization-2.0/updateorganization",
  rawmxbyorg: baseurl.prodbaseurl + "organization-2.0/rawmxbyorg",
  verifiedcountrylist: baseurl.prodbaseurl + "VerifiedCountryDetail-2.0/getVerifiedCountry",
  selfinvite_url: "https://diro.io/user",
  orginfo: baseurl.prodbaseurl + "organization-2.0/getlogo",
  demo_bank_info: baseurl.prodbaseurl + "User-2.0/usrbankdemoinfo",
  bank_user_info: baseurl.prodbaseurl + "User-2.0/usrbankinfo",
  bank_invite_user_email: "https://clients.diro.io/#/invitation",
  sendotp: baseurl.prodbaseurl + "User-2.0/sendOtp",
  recognitionlanguage: baseurl.prodbaseurl + "uploadKyc-2.0/getRecoginition",
  updatefile: baseurl.prodbaseurl + "Admin-2.0/updatefile",
  orgdetails: baseurl.prodbaseurl + "organization-2.0/orgdetails",
  callbacklogs: baseurl.prodbaseurl + "organization-2.0/callbacklog",
  selectlanguage: baseurl.prodbaseurl + "IdMaster-2.0/getcountryname?languages=",
  countryinfo: baseurl.prodbaseurl + "IdMaster-2.0/idInfo",
  updatecountrydata: baseurl.prodbaseurl + "IdMaster-2.0/updatedoc",
  addcomment: baseurl.prodbaseurl + "IdMaster-2.0/addComment",
  showcomment: baseurl.prodbaseurl + "IdMaster-2.0/showComments",
  banklinks: baseurl.prodbaseurl + "IdMaster-2.0/showbanklinks",
  addbanklinks: baseurl.prodbaseurl + "IdMaster-2.0/addbanklink",
  deletebanklinks: baseurl.prodbaseurl + "IdMaster-2.0/deletebanklink",
  editbanklinks: baseurl.prodbaseurl + "IdMaster-2.0/updatebanklink",
  getcallslots: baseurl.prodbaseurl + "Admin-2.0/getcallslots",
  addcallslot: baseurl.prodbaseurl + "Admin-2.0/addslots",
  delete_call_slot: baseurl.prodbaseurl + "Admin-2.0/deleteslots",
  add_link: baseurl.prodbaseurl + "IdMaster-2.0/addlink",
  update_link: baseurl.prodbaseurl + "IdMaster-2.0/updatelink",
  delete_link: baseurl.prodbaseurl + "IdMaster-2.0/deletelink",
  registeruser: baseurl.prodbaseurl + "Admin-2.0/registeruserinfo",
  upload_link_logo: baseurl.prodbaseurl + "Image-2.0/postImage",
  userwithorg: baseurl.prodbaseurl + "Admin-2.0/userwithorg",
  zip_upload: baseurl.prodbaseurl + "boards-2.0/create",
  boards_list: baseurl.prodbaseurl + "boards-2.0/boardlist",
  zip_update: baseurl.prodbaseurl + "boards-2.0/update",
  downloadboard: baseurl.prodbaseurl + "boards-2.0/downloadboard",
  btn_data: baseurl.prodbaseurl + "boards-2.0/createbutton",
  btn_list: baseurl.prodbaseurl + "boards-2.0/buttonlist",
  update_btn: baseurl.prodbaseurl + "boards-2.0/updatebutton",
  country_with_states: baseurl.prodbaseurl + "IdMaster-2.0/countrywithstates",
  worldmap: baseurl.prodbaseurl + "IdMaster-2.0/worldmap",
  getdoc: baseurl.prodbaseurl + "barcode-2.0/getprotaldocument/",
  deletebutton: baseurl.prodbaseurl + "boards-2.0/deletebutton",
  defaultorgapikey: "50015572742fd0470ec30ac9c9477090f",
  bankverification: "https://diro.io/bankverification/",
  downloadmht: baseurl.prodbaseurl + "uploadKyc-2.0/downloadmhtfile",
  request_demo: "https://diro.io/buttons/",
  getbtndata: baseurl.prodbaseurl + "boards-2.0/getbutton",
  banklist: baseurl.prodbaseurl + "IdMaster-2.0/banklinkscategorywise",
  invite: baseurl.prodbaseurl + "organization-2.0/requesteduser",
  getplan: baseurl.prodbaseurl + "Account-2.0/getplan",
  chargecard: baseurl.prodbaseurl + "Account-2.0/chargecard",
  striperedirect: baseurl.prodbaseurl + "Account-2.0/redirect",
  returnurl: "https://diro.io/client/#/manageaccount",
  stripekey: "pk_live_U9USyVzQsNd4nrYvNv8n5nFp",
  getplaninfo: baseurl.prodbaseurl + "Account-2.0/getplaninfo",
  updatesubscription: baseurl.prodbaseurl + "Account-2.0/updatesubscription",
  usagecount: baseurl.prodbaseurl + "Account-2.0/usagecount",
  getverificationlink: baseurl.prodbaseurl + "organization-2.0/getverificationlink",
  sessionstats: baseurl.prodbaseurl + "organization-2.0/sessionstats",
  getVerifiedCountry: baseurl.prodbaseurl + "VerifiedCountryDetail-2.0/getVerifiedCountry",
  btnstatus: baseurl.prodbaseurl + "organization-2.0/buttonstats",
  linklist: baseurl.prodbaseurl + "IdMaster-2.0/link/readall",
  createsource: baseurl.prodbaseurl + "IdMaster-2.0/link/create",
  updatesource: baseurl.prodbaseurl + "IdMaster-2.0/link/update",
  deletesource: baseurl.prodbaseurl + "IdMaster-2.0/link/delete",
  beta: "",
  getverifiedlink: baseurl.prodbaseurl + "organization-2.0/getverificationlink",
  fulltextsearch: baseurl.prodbaseurl + "fulltextsearch-2.0/searchlinks",
  documentjson: baseurl.prodbaseurl + "uploadKyc-2.0/documentjson",
  tagfields: baseurl.prodbaseurl + "uploadKyc-2.0/tagfields",
  addWorker: baseurl.prodbaseurl + "organization-2.0/addworker",
  deleteWorker: baseurl.prodbaseurl + "organization-2.0/deleteworker",
  updateWorker: baseurl.prodbaseurl + "organization-2.0/updateworker",
  ownerTransfer: baseurl.prodbaseurl + "organization-2.0/makeowner",
  getWorker: baseurl.prodbaseurl + "organization-2.0/worker",
  getWorkersList: baseurl.prodbaseurl + "organization-2.0/workers",
  viewkycPageURL: "https://clients.diro.io/#/viewKycReporting/",
  pdfPageUrl: "https://clients.diro.io/#/viewContact/",
  seeCoverage: "https://website-test.diro.io/",
  worldmapurl: "https://clients.diro.io/#/mapview/",
  verification_link: "https://diro.io/verification?buttonid=",
  verification_link_new: "https://session.diro.io/server/#/client/?buttonid=",
  iframe_link: "https://diro.io/verification?ibuttonid=",
  accesstoken: baseurl.prodbaseurl + "organization-2.0/accesstoken",
  feedbackUrl: baseurl.prodbaseurl + "User-2.0/feedback",
  get_lastclicked_link: baseurl.prodbaseurl + "User-2.0/getlastclickedlink",
  deletesession: baseurl.prodbaseurl + "uploadKyc-2.0/deletedocument",
  getmasterfields: baseurl.prodbaseurl + "Admin-2.0/getmasterfields",
  pdftojson: "https://api.dirolabs.com/v2/pdf-to-json",
  extractTransaction: "https://api.diro.io/textract/extractTransaction",
  redoTransactionDoc: "https://api.diro.io/textract/redoTransactionDoc",
  getalluserdata: "https://api.diro.io/ube/get-all-data",
  customerreminder: true,
  getemailreminder: "https://api.diro.io/emailReminder/getemailreminder",
  testEmailReminder: "https://api.diro.io/emailReminder/checkAndSendReminderMail",
  Skey: "6LfMOrwlAAAAANapKjS4i9wOe067YD9s3gcOTSbM",
  recaptcha: "https://api.diro.io/recaptcha/",
  sentryDSN: "https://7fb9e1f598324ec1b2cf29546f702d34@o305199.ingest.sentry.io/4504808263909376",
  fusionAuth: "http://fauth.diro.io/api/",
  fusionAuthKey: "wulgZ0QK8DTRJKV68i_hkCDVUIxD9KddWep6d43b8U0yLgn7nlysnWPr",
  consoleLog: false,
  googleLogo: "https://verificationlinks.diro.io/icons/logo-google.svg",
  blacklisttoken: baseurl.prodbaseurl + "organization-2.0/blacklisttoken",
  deleteblacklisttoken: baseurl.prodbaseurl + "organization-2.0/deleteaccesstoken",
  aplicationFusionauthId: "9cb662c8-0e64-41eb-b8cc-dd8244d12e02",
  fusionAuthApiKey: "r0fzHWjCvWGsx-obEc9q-uv7Vo_hXBT4wAk5JesBpmzVDzHYTAEZJD9x",
  expireRefreshToken: "https://fauth.diro.io/api/jwt/refresh",
  saveOrgData: baseurl.prodbaseurl + "organization-2.0/saveOrgData",
  accesstokenUrl: baseurl.prodbaseurl + "organization-2.0/accesstoken",
  switchServer: baseurl.prodbaseurl + "organization-2.0/switchServer",
  twoFactorLogin: baseurl.prodbaseurl + "organization-2.0/twoFactorLogin",
  sendLoginOtp: "https://api.diro.io/org/api/sendLoginOtp",
  qrCode: "https://api.diro.io/org/api/generateQR",
  sendOtp: "https://api.diro.io/org/api/sendOTP",
  enableTwoFactor: "https://api.diro.io/org/api/enabletwofactor",
  expireRefreshtoken: "https://api.diro.io/org/api/expireRefreshtoken",
  twofactorAutomatedOtp: "https://api.diro.io/org/api/twofactorAutomatedOtp",
  generateSecretToken: baseurl.prodbaseurl + "organization-2.0/generatesecrettoken",
  bypassEmails: ["deepak@diro.io", "praveen@diro.io"],
  getAutoNavData: "https://api.diro.io/auto_nav/getAutoNavData",
  getSingleRequestCallback: "https://prod.dirolabs.com/Zuul-1.0/boards-2.0/sendcallback",
  allowedOrigin: "https://client.diro.io",
  emailAccount: "support@diro.io",
  emailPassword: "Nnvz2f8Qgd9ySGY5",
  emailPort: "587",
  emailHost: "smtp-relay.sendinblue.com",
  upload_widget_CSS_CDN: "https://smartupload.diro.io/widgets/diro.css",
  upload_widget_JS_CDN: "https://smartupload.diro.io/widgets/diro.js",
  capture_widget_CSS_CDN: "https://directlinkwidget-d0awedeyche6e7bu.z03.azurefd.net/directlink-staging/stylesSelectLink.css",
  capture_widget_JS_CDN: "https://directlinkwidget-d0awedeyche6e7bu.z03.azurefd.net/directlink-staging/diroWidgetSelectLink.js",
  varificationSwaggerLink: "/v3",
  varificationSwaggerLinkBeta: "/v2",
  removebg: "https://api.remove.bg/v1.0/removebg",
  removeBgApiKey: "CwVAzNbhcy3uJChuwQYyY1de",
  getS3bucket: "https://list-bucket.diro.me/api/get-bucket-data",
  searchS3bucket: "https://list-bucket.diro.me/api/search-bucket-data",
  uploadverification_link: "https://verify.diro.io/?buttonid=",
};

export { stage1 as env };
export { prodeu };
export { stage2 };
