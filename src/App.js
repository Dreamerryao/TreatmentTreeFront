/*
 * Copyright 2021 Zhejiang University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from "react";
import Panel from "./components/Panel";
import Layout from "./components/Layout";
import TitleBar from "./views/TitleBar/TitleBar";
import {makeStyles} from "@material-ui/core";
import FlowView from "./views/FlowView/FlowView";
import CompareView from "./views/CompareView/CompareView";
import SequenceView from "./views/SequenceView/SequenceView";
import ProjectionView from "./views/ProjectionView/ProjectionView";
import FilterView from "./views/FilterView/FilterView"

const useStyles = makeStyles(theme => ({
    root: {
        background: theme.palette.background.default,
        width: '100vw',
        height: '100vh',
    },
}));

function App() {
    const classes = useStyles();

    return <div className={classes.root}>
        <Layout root container direction={'column'} padding={[0, 0, 0]}>
            <Layout container direction={'row'} padding={0} size={0}>
                <Layout size={1}>
                    <TitleBar/>
                </Layout>
            </Layout>
            <Layout container direction={'column'} padding={0} size={1}>
                <Layout size={9} leaf>
                    <FlowView/>
                </Layout>
            </Layout>
            <Layout container direction={'row'} padding={0} size={1}>
                <Layout container direction={'column'} padding={[0, 0, 0]} size={1}>
                    <Layout size={1}>
                        <FilterView/>
                    </Layout>
                </Layout>
                <Layout container direction={'column'} padding={[0, 0, 0]} size={3}>
                    <Layout size={3}>
                        <CompareView/>
                    </Layout>
                </Layout>
                <Layout container direction={'column'} padding={[0, 0, 0]} size={3}>
                    <Layout size={3}>
                        <SequenceView/>
                    </Layout>
                </Layout>
            </Layout>
        </Layout>
    </div>;
}

export default App;
