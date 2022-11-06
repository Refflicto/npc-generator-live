import React from "react";
import PropTypes from "prop-types";

const initAd = () => {
  (window.adsbygoogle = window.adsbygoogle || []).push({});
};

class AdComponent extends React.Component {
  componentDidMount() {
    initAd();
  }

  shouldComponentUpdate(nextProps) {
    const {
      props: { path },
    } = this;
    return nextProps.path !== path;
  }

  componentDidUpdate() {
    initAd();
  }

  render() {
    const { children, className, path } = this.props;
    return (
      <div key={path} className={`AdComponent ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-8996586400495676"
          data-ad-slot="8142577961"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }
}

AdComponent.propTypes = {
  path: PropTypes.string.isRequired,
  className: PropTypes.string,
};

AdComponent.defaultProps = {
  className: "",
};

export default AdComponent;
