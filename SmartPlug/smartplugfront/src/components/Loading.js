import React, {useMemo} from 'react';
import {CircularProgress, LinearProgress} from '@material-ui/core';
import {oneOf} from 'prop-types';

export const LOADING_TYPES = {
    circular: 'circular',
    linear: 'linear'
}

const Loading = (props) => {
    const {type} = props;

    const loading = useMemo(() => {
        switch (type) {
            case LOADING_TYPES.circular: {
                return <CircularProgress/>;
            }
            case LOADING_TYPES.linear: {
                return <LinearProgress/>;
            }
            default: {
                return null;
            }
        }
    }, [type]);

    return <div className={'loading'}>
        {loading}
    </div>
}

Loading.propTypes = {
    type: oneOf(Object.values(LOADING_TYPES)),
};

Loading.defaultProps = {
    type: LOADING_TYPES.circular
};

export default Loading;
