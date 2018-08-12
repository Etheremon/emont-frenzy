import React from "react"

require("style-loader!./TabsView.scss");


class TabsView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={`ui secondary stackable pointing inverted menu tabs-view ${this.props.centered ? 'tabs-view--centered' : ''}`}>
        {
          this.props.tabs.map((tab, idx) => (
            <a key={idx}
               className={`${this.props.selectedTab === tab[0] ? "active" : ""} item`}
               onClick={() => {this.props.handleOnTabSelect && this.props.handleOnTabSelect(tab[0])}}>
              {tab[1]}
            </a>
          ))
        }

        {this.props.handleOnRefresh
          ? <div className="right menu">
              <div className="item">
                <i className="refresh link icon" onClick={this.props.handleOnRefresh}/>
              </div>
            </div>
          : null
        }

        {this.props.customRightItem
          ? <div className="right menu">
            <div className="item">
              {this.props.customRightItem}
            </div>
          </div>
          : null
        }
      </div>
    );
  }
}

TabsView.defaultProps = {
  tabs: [],
  selectedTab: [],
  handleOnTabSelect: undefined,
  handleOnRefresh: undefined,
  centered: false,
};

export default TabsView;
