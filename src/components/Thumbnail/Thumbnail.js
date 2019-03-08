import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import core from 'core';
import { isMobile } from 'helpers/device';
import actions from 'actions';
import selectors from 'selectors';

import './Thumbnail.scss';

class Thumbnail extends React.PureComponent {
  static propTypes = {
    index: PropTypes.number.isRequired,
    currentPage: PropTypes.number,
    pageLabels: PropTypes.array.isRequired,
    canLoad: PropTypes.bool.isRequired,
    onLoad: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    customThumbnailRenderer: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
    this.thumbContainer = React.createRef();
  }

  componentDidMount() {
    const { 
      onLoad, 
      index,
      customThumbnailRenderer,
    } = this.props;
    let thumbnailContainer;

    if (customThumbnailRenderer && typeof customThumbnailRenderer === 'function') {
      thumbnailContainer = this.createThumbnailContainer();

      const element = customThumbnailRenderer({
        pageNumber: index + 1,
        thumbnailContainer
      });
      this.wrapper.current.appendChild(element);
    } else {
      thumbnailContainer = this.thumbContainer.current;
    }

    onLoad(index, thumbnailContainer);
  }

  componentDidUpdate(prevProps) {
    const { 
      onLoad, 
      onCancel, 
      onRemove,
      index, 
      customThumbnailRenderer
    } = this.props;

    if (!prevProps.canLoad && this.props.canLoad) {
      onLoad(index, this.thumbContainer.current);
    } 

    if (prevProps.canLoad && !this.props.canLoad) {
      onCancel(index);
    }

    if (
      prevProps.customThumbnailRenderer !== this.props.customThumbnailRenderer && 
      typeof customThumbnailRenderer === 'function'
    ) {
      this.emptyNode(this.wrapper.current);

      const thumbnailContainer = this.createThumbnailContainer();
      const element = customThumbnailRenderer({
        pageNumber: index + 1,
        thumbnailContainer
      });
      this.wrapper.current.appendChild(element);
      onRemove(index);
      onLoad(index, thumbnailContainer);
    }
  }

  componentWillUnmount() {
    const { onRemove, index } = this.props;
    
    onRemove(index);
  }

  createThumbnailContainer = () => {
    const thumbnailContainer = document.createElement('div');

    thumbnailContainer.addEventListener('click', this.handleClick);
    thumbnailContainer.classList.add('container');

    return thumbnailContainer;
  }

  emptyNode = element => {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  handleClick = () => {
    const { index, closeElement} = this.props;

    core.setCurrentPage(index + 1);

    if (isMobile()) {
      closeElement('leftPanel');
    }
  }

  render() {
    const { 
      index, 
      currentPage, 
      pageLabels,
      customThumbnailRenderer
    } = this.props;
    const isActive = currentPage === index + 1;
    const pageLabel = pageLabels[index];

    return (
      <div className={`Thumbnail ${isActive ? 'active' : ''}`} ref={this.wrapper}>
        {customThumbnailRenderer
          // user can customize what is being rendered in the thumbnail. In this case we don't render anything and
          // instead we get the DOM element returned by their custom render function and append it here
          ? null
          : (
            <React.Fragment>
              <div className="container" ref={this.thumbContainer} onClick={this.handleClick}></div>
              <div className="page-label">{pageLabel}</div>
            </React.Fragment>
          )
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentPage: selectors.getCurrentPage(state),
  pageLabels: selectors.getPageLabels(state),
  customThumbnailRenderer: selectors.getCustomThumbnailRenderer(state)
});

const mapDispatchToProps = {
  closeElement: actions.closeElement
};

export default connect(mapStateToProps, mapDispatchToProps)(Thumbnail);