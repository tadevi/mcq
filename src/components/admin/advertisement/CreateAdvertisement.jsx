//ten,link to site, link image
import React, { useState } from "react";
import {
  Form,
  Select,
  Checkbox,
  Message} from "semantic-ui-react";

const directionOptions = [
  {
    key: "horizontal",
    value: "horizontal",
    text: "Ngang"
  },
  {
    key: "vertical",
    value: "vertical",
    text: "Dọc"
  }
];

const initialState = {
  name: "",
  linkClick: "",
  linkImage: "",
  type: "horizontal",
  active: true
};

function CreateAdvertisement({ data, onChange, error }) {
  const [state, setState] = useState(data || initialState);

  const handleChange = (_, { name, value }) => {
    console.log(state);
    let newState = {};
    if (name === "active") {
      //this is checkbox
      newState = {
        ...state,
        active: !state.active
      };
    } else {
      newState = {
        ...state,
        [name]: value
      };
    }
    setState(newState);
    if (typeof onChange === "function") {
      onChange(newState);
    }
  };

  return (
    <Form>
      <Form.Field>
        <Form.Input
          fluid
          label="Tên quảng cáo"
          name="name"
          value={state.name}
          onChange={handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Form.Input
          label="Liên kết quảng cáo"
          fluid
          value={state.linkClick}
          name="linkClick"
          onChange={handleChange}
        />
      </Form.Field>
      <Form.Field>
        <Form.Input
          label="Liên kết hình ảnh"
          fluid
          value={state.linkImage}
          name="linkImage"
          onChange={handleChange}
        />
      </Form.Field>
      <Form.Field>
        <label>Hướng của hình ảnh:</label>
        <Select
          fluid
          options={directionOptions}
          onChange={handleChange}
          name="type"
          value={state.type}
        />
      </Form.Field>

      <Form.Field>
        <Checkbox
          checked={state.active}
          name="active"
          onChange={handleChange}
          label="Hiển thị"
        />
      </Form.Field>
      <Message
        error
        hidden={error===''}
        content={error}
        />
    </Form>
  );
}

export default CreateAdvertisement;
