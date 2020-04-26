import React from "react";
import {
  Table,
  Button,
  Icon,
  Input,
  Loader,
  Modal,
  Pagination,
  Message,
  Grid
} from "semantic-ui-react";
import {
  userCall,
  userCallWithData,
  QueryString
} from "../../../utils/ApiUtils";
import { SERVER_API } from "../../../config";
import { useState } from "react";
import { useEffect } from "react";
import Moment from "react-moment";
import CreateAdvertisement from "./CreateAdvertisement";
import { stringResources } from "../../../Resources";
/*
view: 0
click: 0
active: true
_id: "5e7ca9af388186002d5efed2"
name: "abc"
linkClick: "http://google.com"
linkImage: "https://drive.google.com/file/d/0B3PEcyo1cFMEX2tNQm1XTjZKR2c/view"
type: "vertical"
datetime: "2020-03-26T13:10:07.873Z"
*/
const screenName = "advertisement";

function TableContent({
  data,
  onEditItemClick,
  onDeleteItemClick,
  onSortChange
}) {
  const [sortLabel,setSortLabel]=useState('datetime')
  const [direction, setDirection]=useState('ascending')

  const BodyContent = ({ data }) => {
    if (!data) return null;
    if (data.length === 0) {
      return <p>Không có dữ liệu</p>;
    }
    return data.map(({ name, datetime, view, active, type, _id }, index) => {
      return (
        <Table.Row key={_id}>
          <Table.Cell>{name}</Table.Cell>
          <Table.Cell>
            <Moment format="DD/MM/YYYY HH:mm">{datetime}</Moment>
          </Table.Cell>
          <Table.Cell>
            {type === "vertical"
              ? stringResources[screenName].labelVertical
              : stringResources[screenName].labelHorizontal}
          </Table.Cell>
          <Table.Cell>{view}</Table.Cell>
          <Table.Cell>
            {active
              ? stringResources[screenName].labelActive
              : stringResources[screenName].labelInActive}
          </Table.Cell>
          <Table.Cell>
            <Button.Group>
              <Button
                basic
                icon={
                  <Icon
                    name={"edit"}
                    color={"orange"}
                    onClick={() => onEditItemClick(_id)}
                  />
                }
              />
              <Button
                basic
                icon={
                  <Icon
                    name={"delete"}
                    color={"red"}
                    onClick={() => onDeleteItemClick(_id)}
                  />
                }
              />
            </Button.Group>
          </Table.Cell>
        </Table.Row>
      );
    });
  };
  const labelChange = label => {
    if (label === sortLabel) {
      if(direction==='ascending'){
        setDirection('descending')
        onSortChange({label:label,direction:'-'})
      }
      else{
        setDirection('ascending')
        onSortChange({label:label,direction:'+'})
      }
    }
    else{
      setSortLabel(label)
      setDirection('ascending')
      onSortChange({label,direction:'+'})
    }
  };
  const getDirection = label => {
    return label === sortLabel ? direction : null;
  };
  return (
    <Table sortable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell
            sorted={getDirection("name")}
            onClick={() => labelChange("name")}
          >
            {stringResources[screenName].labelName}
          </Table.HeaderCell>
          <Table.HeaderCell
            sorted={getDirection("datetime")}
            onClick={() => labelChange("datetime")}
          >
            {stringResources[screenName].labelDateCreate}
          </Table.HeaderCell>
          <Table.HeaderCell>
            {stringResources[screenName].labelType}
          </Table.HeaderCell>
          <Table.HeaderCell
            sorted={getDirection("view")}
            onClick={() => labelChange("view")}
          >
            {stringResources[screenName].labelViews}
          </Table.HeaderCell>
          <Table.HeaderCell>
            {stringResources[screenName].labelStatus}
          </Table.HeaderCell>
          <Table.HeaderCell>
            {stringResources[screenName].labelAction}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <BodyContent data={data} />
      </Table.Body>
    </Table>
  );
}

function EditAdsModel({
  open,
  onClose,
  onOK,
  data,
  onChange,
  editMode,
  error
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>
        {editMode
          ? stringResources[screenName].labelEdit
          : stringResources[screenName].labelNew}
      </Modal.Header>
      <Modal.Content>
        <CreateAdvertisement data={data} onChange={onChange} error={error} />
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={onClose}>
          <Icon name="remove" /> {stringResources[screenName].labelBtnExit}
        </Button>
        <Button color="green" onClick={onOK}>
          <Icon name="checkmark" /> {stringResources[screenName].labelBtnAccept}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

function DeleteWarningModel({ open, onClose, onOK }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>{stringResources[screenName].labelWarning}</Modal.Header>
      <Modal.Content>
        {stringResources[screenName].labelMessageDeleteConfirm}
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" onClick={onClose}>
          <Icon name="remove" /> {stringResources[screenName].labelBtnExit}
        </Button>
        <Button color="green" onClick={onOK}>
          <Icon name="checkmark" /> {stringResources[screenName].labelBtnAccept}
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
function AdsPagination({ data, onPageChange }) {
  const { totalPage, page } = data;
  if (totalPage > 1)
    return (
      <Pagination
        activePage={page || 1}
        onPageChange={(e, { activePage }) => onPageChange(activePage)}
        totalPages={totalPage}
      />
    );
  return <div />;
}

const checkRequest = req => setError => {
  if (!req.name) {
    setError(stringResources[screenName].labelAdsNameError);
    return false;
  }
  if (!req.linkClick) {
    setError(stringResources[screenName].labelAdsLinkError);
    return false;
  }
  if (!req.linkImage) {
    setError(stringResources[screenName].labelAdsImageError);
    return false;
  }
  if (!req.type) {
    setError(stringResources[screenName].labelAdsTypeError);
    return false;
  }
  if (!req.hasOwnProperty("active")) {
    setError(stringResources[screenName].labelAdsStatusError);
    return false;
  }
  return true;
};

function TableAdvertisement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({});
  const [textSearch, setTextSearch] = useState("");

  const [isModelOpen, setModelOpen] = useState(false);
  const [isWarningOpen, setWarningOpen] = useState(false);
  const [editedAds, setEditedAds] = useState({});
  const [deleteId, setDeleteId] = useState("");
  const [isEditMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState("");

  const getListAds = ({ limit, page, active, search, sortDirection, labelSort }) => {
    const queryString = new QueryString();
    queryString.put("limit", limit || 10);
    queryString.put("page", page || 1);
    queryString.put("active", active);
    queryString.put("sort", (sortDirection||'+') + (labelSort||'datetime'));
    queryString.put("search", search || undefined);

    setLoading(true);
    userCall(
      "GET",
      `${SERVER_API}/qcs${queryString.get()}`,
      setData,
      setErrorWithTimeOut,
      setErrorWithTimeOut,
      () => setLoading(false)
    );
  };

  const setErrorWithTimeOut = error => {
    setError(error);
    setTimeout(() => setError(""), 5000);
  };

  const setSuccessWithTimeOut = success => {
    setSuccess(success);
    setTimeout(() => setSuccess(""), 5000);
  };

  const getAdsById = id => {
    setLoading(true);
    userCall(
      "GET",
      `${SERVER_API}/qcs/${id}`,
      data => {
        setEditedAds(data);
        setEditMode(true);
        setModelOpen(true);
      },
      setErrorWithTimeOut,
      setErrorWithTimeOut,
      () => setLoading(false)
    );
  };

  const putAds = () => {
    const { _id, ...dt } = editedAds;
    if (!checkRequest(dt)(setErrorWithTimeOut)) return;
    setLoading(true);
    userCallWithData(
      "PUT",
      `${SERVER_API}/qcs/${_id}`,
      dt,
      () => {
        setSuccessWithTimeOut(stringResources[screenName].labelEditAdsSuccess);
        getListAds({ page: data.page, search: textSearch });
      },
      setErrorWithTimeOut,
      setErrorWithTimeOut,
      () => setLoading(false)
    );
  };

  const onDeleteAdsClick = id => {
    setDeleteId(id);
    setWarningOpen(true);
  };

  const deleteAds = () => {
    setWarningOpen(false);
    setLoading(true);
    userCall(
      "DELETE",
      `${SERVER_API}/qcs/${deleteId}`,
      () => {
        setDeleteId("");
        getListAds({ page: data.page, search: textSearch });
        setSuccessWithTimeOut(
          stringResources[screenName].labelDeleteAdsSuccess
        );
      },
      setErrorWithTimeOut,
      setErrorWithTimeOut,
      () => {
        setLoading(false);
      }
    );
  };
  const postAds = () => {
    const { _id, ...dt } = editedAds;
    if (!checkRequest(dt)(setErrorWithTimeOut)) return;
    setLoading(true);
    userCallWithData(
      "POST",
      `${SERVER_API}/qcs`,
      dt,
      res => {
        setSuccessWithTimeOut(stringResources[screenName].labelAddAdsSuccess);
        getListAds({ page: data.page, search: textSearch });
      },
      setErrorWithTimeOut,
      setErrorWithTimeOut,
      () => setLoading(false)
    );
  };

  useEffect(() => {
    getListAds({});
  }, []);

  return (
    <div>
      <span style={{ display: "block", overflow: "hidden", width: "100%" }}>
        <Input
          icon={"search"}
          iconPosition={"left"}
          style={{ width: "90%", marginTop: "30px", marginRight: "2em" }}
          placeholder={stringResources[screenName].placeholderSearch}
          value={textSearch}
          onChange={(e, { value }) => setTextSearch(value)}
          onKeyPress={e => {
            if (e.key === "Enter") {
              getListAds({ search: textSearch });
            }
          }}
        />
        <Button
          basic
          color="green"
          onClick={() => {
            setEditMode(false);
            setEditedAds({});
            setModelOpen(true);
          }}
          icon="plus"
        />
      </span>
      <Message error hidden={error === ""} content={error} />
      <Message success hidden={success === ""} content={success} />
      <TableContent
        onSortChange={({direction, label})=>getListAds({sortDirection:direction,labelSort:label})}
        data={data.data}
        onEditItemClick={getAdsById}
        onDeleteItemClick={onDeleteAdsClick}
      />

      <AdsPagination
        data={data}
        onPageChange={currentPage =>
          getListAds({ search: textSearch, page: currentPage })
        }
      />
      <EditAdsModel
        open={isModelOpen}
        editMode={isEditMode}
        onClose={() => setModelOpen(false)}
        onChange={setEditedAds}
        onOK={() => {
          if (isEditMode) putAds();
          else postAds();
          setModelOpen(false);
        }}
        data={editedAds}
        error={error}
      />
      <DeleteWarningModel
        open={isWarningOpen}
        onClose={() => setWarningOpen(false)}
        onOK={deleteAds}
      />
      <Loader active={loading} />
    </div>
  );
}

export default TableAdvertisement;
