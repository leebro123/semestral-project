import React from 'react';
import {Checkbox, withStyles} from '@material-ui/core';
import {purple, amber, red} from '@material-ui/core/colors';

export const RedCheckbox = withStyles({
    root: {
        color: red[400],
        '&$checked': {
            color: red[600],
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

export const PurpleCheckbox = withStyles({
    root: {
        color: purple[400],
        '&$checked': {
            color: purple[600],
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);

export const AmberCheckbox = withStyles({
    root: {
        color: amber[400],
        '&$checked': {
            color: amber[600],
        },
    },
    checked: {},
})((props) => <Checkbox color="default" {...props} />);
