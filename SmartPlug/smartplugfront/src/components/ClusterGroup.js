import React, {useCallback, useState} from 'react';
import {string, element, oneOfType, bool} from 'prop-types';

const ClusterGroup = (props) => {

    const [isOpened, setIsOpened] = useState(props.open);

    const onClickHandler = useCallback(() => {
        setIsOpened(!isOpened);
    }, [isOpened]);

    return <div className={'clusterGroup'}>
        <div className={'clusterGroup__panel'} onClick={onClickHandler}>
            <div className={'clusterGroup__header'}>
                {props.heading}
            </div>
        </div>
        <div className={`clusterGroup__content ${isOpened ? 'clusterGroup__content--open' : null}`}>
            <div className={'clusterGroup__contentInside'}>
                {props.children}
            </div>
        </div>
    </div>;
};

ClusterGroup.propTypes = {
    heading: oneOfType([string, element]).isRequired,
    open: bool.isRequired
};

ClusterGroup.defaultProps = {
    open: false
};

export default ClusterGroup;
