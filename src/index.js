/*
 * Copyright 2021 Zhejiang University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider} from "mobx-react";
import store from "./store/Store";
import {createMuiTheme, darken, fade, lighten, MuiThemeProvider, CssBaseline} from "@material-ui/core";

ReactDOM.render(
    <Provider d={store}>
        <MuiThemeProvider theme={createMuiTheme({
            spacing: 10,
            typography: {
                h6: {
                    fontWeight: 'bold'
                },
                subtitle1: {
                    fontWeight: 'bold'
                }
            },
            palette: {
                background: {
                    default: 'rgb(233, 233, 233)',
                },
                component: {
                    default: 'rgb(133, 133, 133)',
                }
            },
            overrides: {
                MuiCssBaseline: {
                    '@global': {
                        '*::-webkit-scrollbar': {
                            width: 10,
                            height: 10,
                        },
                        '*::-webkit-scrollbar-track': {
                            display: 'none',
                        },
                        '*::-webkit-scrollbar-corner': {
                            display: 'none',
                        },
                        '*::-webkit-scrollbar-thumb': {
                            backgroundColor: fade('rgb(33, 33, 33)', 0.1),
                            borderRadius: 10,
                        },
                        '*:hover::-webkit-scrollbar-thumb': {
                            backgroundColor: lighten('rgb(33, 33, 33)', 0.2),
                        },
                        '*::-webkit-scrollbar-thumb:hover': {
                            backgroundColor: 'rgb(33, 33, 33)',
                        },
                        '*::-webkit-scrollbar-thumb:active': {
                            backgroundColor: darken('rgb(33, 33, 33)', 0.2),
                        }
                    }
                }
            }
        })}>
            <CssBaseline/>
            <App/>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
);
