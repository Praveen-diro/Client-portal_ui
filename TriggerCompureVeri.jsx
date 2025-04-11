import React, { useEffect, useState } from "react";
import { Row, Col, Input, Label, Alert, Button } from "reactstrap";
import { Modal, ModalBody } from 'reactstrap';
import { CopyToClipboard } from "react-copy-to-clipboard";
import Spinner from "../../spinner/Spinner";
import { env as environment } from "../../../actions/environment";
import { buttonService } from "../../../app/services/button.service";
import faExpand from '../../../assets/images/icon/chrome-restore.svg';
import faCompress from '../../../assets/images/icon/chrome-maximize.svg';

const TriggerCompureVeri = ({ setshowmodal, match }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [copiedapiref, setCopyModalapiref] = useState(false);
  const [loading, setLoading] = useState(true);
  const [buttons, setButtons] = useState([]);
  const [buttonid, setButtonId] = useState("");
  const [modal, setModal] = useState(true);

  let buttonList;
  if (buttons.length > 0) {
    buttonList = buttons.map((value, key) => (
      <option key={key} value={value.buttonid}>
        {value.btndata.name}
      </option>
    ));
  }

  const onDismiss = () => {
    setCopyModalapiref(false);
  };

  const copyclipboard2 = () => {
    setCopyModalapiref(true);
    setTimeout(() => {
      setCopyModalapiref(false);
    }, 5000);
  };

  useEffect(() => {
    // Load buttons on component mount
    fetchButtons();
    
    // Load specific button if ID is in the URL
    if (match?.params?.id) {
      fetchButton(match.params.id);
    }
  }, [match]);

  const fetchButtons = async () => {
    setLoading(true);
    try {
      const response = await buttonService.getButtons();
      if (response.success && response.data) {
        const buttonData = response.data.data || [];
        setButtons(buttonData);
        
        // Set first button as selected if none is selected yet
        if (buttonData.length > 0 && !buttonid) {
          setButtonId(buttonData[0].buttonid);
        }
      }
    } catch (error) {
      console.error("Error fetching buttons:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchButton = async (id) => {
    try {
      const response = await buttonService.getButton(id);
      if (response.success && response.data) {
        setButtonId(id);
      }
    } catch (error) {
      console.error("Error fetching button:", error);
    }
  };

  const onChange = (e) => {
    setButtonId(e.target.value);
    fetchButton(e.target.value);
  };

  const toggle = () => {
    setModal(!modal);
    setshowmodal("");
  };

  const closeModal = () => {
    setModal(false);
    setshowmodal("");
  };
  
  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const modalClassName = isMaximized ? "modalstyle-maximized" : "modalstyle";
  
  return (
    <React.Fragment>
      <Modal isOpen={modal} toggle={toggle} className={modalClassName} backdropClassName='modal-backdrop-blur'>
        <ModalBody className="modalbody" style={{ paddingTop: "0rem" }}>
          <div style={{ position: "sticky", top: 0, zIndex: 1000, display: "flex", justifyContent: "flex-end", background: "hsl(188, 68%, 91%)",paddingTop:"1rem" }}>
            <img
              src={isMaximized ? faExpand : faCompress}
              alt="Maximize"
              style={{ width: "30px", height: "25px", cursor: "pointer", marginRight: "0.5rem", marginTop: "-0.5rem"}}
              onClick={toggleMaximize} onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault(); 
                  toggleMaximize();
                }
              }}
            />
            <button
              className="CloseModal"
              style={{ background: "none", border: "none", cursor: "pointer", outline: "none" }}
              onClick={closeModal}
            >
              &times;
            </button>
          </div>
          {loading ? (
            <Spinner />
          ) : (
            <React.Fragment>
              {copiedapiref && (
                <div className="mb-4 mx-4 p-3 bg-green-100 border border-green-200 rounded-md text-green-800 flex items-center gap-2">
                  <i className="fa fa-check-circle"></i>
                  <span>Copied to clipboard!</span>
                </div>
              )}
              
              <div className="px-4 mb-6 flex flex-wrap items-center gap-4">
                <label className="font-medium text-gray-700" style={{marginTop:"10px"}}>Select button:</label>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 transition-colors cursor-pointer"
                  style={{
                    minWidth: "200px",
                    height: "40px",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)"
                  }}
                  value={buttonid || ""}
                  onChange={(e) => onChange(e)}
                >
                  {buttons.map((value, key) => (
                    <option key={key} value={value.buttonid}>
                      {value.btndata.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <h3 className="px-4 py-1 card-title">
                <b>Advanced features</b>
              </h3>{" "}
       
             <div id="compare-and-verify-user-data">
              
              <h4 className=" px-4 py-1 mb-0 card-title" >
                Compare and verify user data
              </h4>
                
              <p className="px-4 py-1 card-title">
                You can enable automatic matching by passing user data for multiple
                fields inside the no-code link. DIRO will automatically start
                returning a matching score along with extracted data inside the
                PDF-to-JSON results.
              </p>
              <p className="px-4 py-3 mb-0 card-title">
                Copy the link from the verification button and then
              </p>{" "}
              <ul className="ml-4">
                <li>Add field label as query parameter in no code link.</li>{" "}
                <li>
                  Please do not use tag or dictionary name as query parameter.
                </li>
              </ul>{" "}
              <p className="px-4 py-3 mb-0 card-title"> For example – </p>
              <div className="px-4 space-y-4">
                <div>
                  <p className="mb-2">If field label is firstname:</p>
                  <div className="bg-gray-100 p-3 rounded border border-gray-200 text-sm font-mono overflow-x-auto">
                    https://diro.io/verification?buttonid=1df72675-aa9f-ce28-cb80-069550744811&trackid=
                    {"<"}trackid{">"}&firstname={"<"}YOUR FIRSTNAME{">"}
                  </div>
                </div>
                
                <div>
                  <p className="mb-2">If you have three verification fields. firstname, lastname and zipcode:</p>
                  <div className="bg-gray-100 p-3 rounded border border-gray-200 text-sm font-mono overflow-x-auto">
                    https://diro.io/verification?buttonid=1df72675-aa9f-ce28-cb80-069550744811&trackid=
                    {"<"}TRACK_ID{">"}&firstname={"<"}YOUR FIRSTNAME{">"}&lastname=
                    {"<"}YOUR LASTNAME{">"}&zipcode={"<"}YOUR ZIPCODE{">"}
                  </div>
                </div>
              </div>
              <p className="px-4 py-1 card-title">
                Note : Please follow URL encoding while building no-code URL. Refer {" "}
                <a href="https://session.diro.live/server/#/client/?buttonid=">
                  HTML URL
                </a>  
                
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
                  <p className="font-medium">Your verification link:</p>
                  <div className="flex items-center w-full">
                    <code className="bg-gray-100 px-3 py-1.5 rounded text-sm overflow-x-auto flex-1 border border-gray-200">
                      {environment.verification_link + buttonid + "&trackid="}
                    </code>
                    <CopyToClipboard
                      text={environment.verification_link + buttonid + "&trackid="}
                      onCopy={copyclipboard2}
                    >
                      <button className="ml-2 p-2 text-blue-600 hover:text-blue-800 transition-colors">
                        <i className="fa fa-copy"></i>
                      </button>
                    </CopyToClipboard>
                  </div>
                </div>
                
                encoding for proper formatting.
              </p>
            </div>
          </React.Fragment>
        )}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default TriggerCompureVeri; 