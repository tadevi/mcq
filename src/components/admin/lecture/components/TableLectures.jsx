import React, { createRef } from "react";
import { Button, Confirm, Icon, Table } from "semantic-ui-react";
import Moment from "react-moment";
import "../../style/style.css";
import { PLAN_LABEL, PLAN_TYPE } from "../../../constant/ServerConst";
import Plan from "../../components/Plan";

class TableLectures extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lectures: props.data || {},
      confirm: false,
      lectureId: null,
      sortColumn: "datetime",
      sortDirection: "descending",
    };
    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onEditClick = this.onEditClick.bind(this);
    this.onCancelConfirm = this.onCancelConfirm.bind(this);
    this.onAcceptConfirm = this.onAcceptConfirm.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.data !== prevProps.data) {
      this.setState({
        lectures: this.props.data,
      });
    }
  }

  onEditClick(id) {
    const { onEdit } = this.props;
    if (typeof onEdit === "function") {
      onEdit(id);
    }
  }

  onDeleteClick(id) {
    this.setState({
      confirm: true,
      lectureId: id,
    });
  }

  onCancelConfirm() {
    this.setState({
      confirm: false,
    });
  }

  onAcceptConfirm() {
    this.setState({
      confirm: false,
    });
    const { onDelete } = this.props;
    if (typeof onDelete === "function") {
      onDelete(this.state.lectureId);
    }
  }

  render() {
    return (
      <div>
        <Table size={"small"} selectable basic sortable={true}>
          {this.renderHeader()}
          <Table.Body>{this.renderTableContent()}</Table.Body>
        </Table>
        {this.renderConfirm()}
      </div>
    );
  }

  renderConfirm() {
    return (
      <Confirm
        open={this.state.confirm}
        content="Bạn có muốn xóa bài giảng này ra khỏi danh sách?"
        onCancel={this.onCancelConfirm}
        onConfirm={this.onAcceptConfirm}
      />
    );
  }

  renderHeader() {
    const handleSortClick = (name) => {
      const { onSortChange } = this.props;
      let direction = this.state.sortDirection;
      if (name === this.state.sortColumn) {
        if (direction === "ascending") direction = "descending";
        else direction = "ascending";
      }
      this.setState({
        sortColumn: name,
        sortDirection: direction,
      });

      if (typeof onSortChange === "function") {
        onSortChange({
          sortDirection: direction,
          sortColumn: name,
        });
      }
    };
    const sortLabel = (name) =>
      this.state.sortColumn === name ? this.state.sortDirection : null;
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textAlign={"center"}>Lớp</Table.HeaderCell>
          <Table.HeaderCell textAlign={"center"}>Môn</Table.HeaderCell>
          <Table.HeaderCell textAlign={"center"}>Chương</Table.HeaderCell>
          <Table.HeaderCell textAlign={"center"}>Bài</Table.HeaderCell>
          <Table.HeaderCell
            textAlign={"center"}
            sorted={sortLabel("name")}
            onClick={() => handleSortClick("name")}
          >
            Bài giảng
          </Table.HeaderCell>
          <Table.HeaderCell
            textAlign={"center"}
            sorted={sortLabel("datetime")}
            onClick={() => handleSortClick("datetime")}
          >
            Ngày tạo
          </Table.HeaderCell>
          <Table.HeaderCell textAlign={"center"}>Người tạo</Table.HeaderCell>
          <Table.HeaderCell textAlign={"center"}>Hành động</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  renderTableContent() {
    const lectureData = this.state.lectures.data || [];
    return lectureData.length > 0 ? (
      lectureData.map((item) => {
        return (
          <Table.Row
            key={item._id}
            style={{ cursor: "pointer" }}
            onClick={() => window.open(item.lectureUrl, "_blank")}
          >
            <Table.Cell>{item.className}</Table.Cell>
            <Table.Cell>{item.subjectName}</Table.Cell>
            <Table.Cell>{item.contentName}</Table.Cell>
            <Table.Cell>{item.lessonName}</Table.Cell>
            <Table.Cell>
              <Plan plan={item[PLAN_LABEL]} />
                {item.name}
            </Table.Cell>
            <Table.Cell>
              <Moment format="DD/MM/YYYY HH:mm">{item.datetime}</Moment>
            </Table.Cell>
            <Table.Cell>{item.userEmail}</Table.Cell>
            <Table.Cell>
              <Button.Group>
                <Button
                  basic
                  icon={<Icon name={"edit"} color={"orange"} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    this.onEditClick(item._id);
                  }}
                />
                <Button
                  basic
                  icon={<Icon name={"delete"} color={"red"} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    this.onDeleteClick(item._id);
                  }}
                />
              </Button.Group>
            </Table.Cell>
          </Table.Row>
        );
      })
    ) : (
      <Table.Row>
        <Table.Cell>Không có dữ liệu</Table.Cell>
      </Table.Row>
    );
  }
}

export default TableLectures;
