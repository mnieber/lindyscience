import React from 'react'

export class Placeholder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      innerHtml: {__html: ''}
    }
  }

  componentWillMount() {
    this.props.loadPlaceholder()
    .then(innerHtml => this.setState({innerHtml: {__html: innerHtml}}));
  }

  render() {
    return (
      <div
        dangerouslySetInnerHTML={this.state.innerHtml}
      />
    )
  }
}
