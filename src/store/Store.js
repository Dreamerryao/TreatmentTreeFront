import { action, makeAutoObservable, observable } from "mobx";
import { get, post, put, del } from "./Fetcher";
import csvParser from "csv-parser";


class Store {
    constructor() {
        makeAutoObservable(this);
        this.initData();
        // this.filterInit();
        document.oncontextmenu = e => e.preventDefault();
    }

    //region Color Encoding
    colors = ['rgb(212,78,64)', 'rgb(86,165,92)', 'rgb(78,131,237)', 'rgb(241,190,65)'];
    mortalityColor = ['rgb(212,78,64)', 'rgb(86,165,92)'];
    highlight = ['rgb(212,78,64)', '#f39189'];
    actionColor = ['rgb(78,131,237)', 'rgb(241,190,65)'];
    branchColor = [
        // 'rgb(141,211,199)',
        // 'rgb(190,186,218)',
        // 'rgb(251,128,114)',
        // 'rgb(128,177,211)',
        // 'rgb(253,180,98)',
        // 'rgb(179,222,105)',
        // 'rgb(252,205,229)',
        // 'rgb(217,217,217)',
        // 'rgb(188,128,189)',
        // 'rgb(204,235,197)',
        // 'rgb(255,237,111)',
        'rgb(133,133,133)'
    ];
    recordBinColor = ['rgb(203,24,29)', 'rgb(251,106,74)', 'rgb(252,187,161)'];
    recordRangeColor = ['rgb(1,102,94)', 'rgb(166,217,106)', 'rgb(140,81,10)'];
    //endregion

    actionsLimit = 3;

    graph = [];
    loadGraph = graph => {
        this.graph = graph;
        this.initGraphReady = true;
    }

    // columns = ['bloc','icustayid','charttime','gender','age','elixhauser','re_admission','died_in_hosp','died_within_48h_of_out_time','mortality_90d','delay_end_of_record_and_discharge_or_death','Height_cm','Weight_kg','GCS','RASS','HR','SysBP','MeanBP','DiaBP','RR','SpO2','Temp_C','Temp_F','CVP','PAPsys','PAPmean','PAPdia','CI','SVR','Interface','FiO2_100','FiO2_1','O2flow','PEEP','TidalVolume','MinuteVentil','PAWmean','PAWpeak','PAWplateau','Potassium','Sodium','Chloride','Glucose','BUN','Creatinine','Magnesium','Calcium','Ionised_Ca','CO2_mEqL','SGOT','SGPT','Total_bili','Direct_bili','Total_protein','Albumin','Troponin','CRP','Hb','Ht','RBC_count','WBC_count','Platelets_count','PTT','PT','ACT','INR','Arterial_pH','paO2','paCO2','Arterial_BE','Arterial_lactate','HCO3','ETCO2','SvO2','mechvent','extubated','Shock_Index','PaO2_FiO2','median_dose_vaso','max_dose_vaso','input_total','input_4hourly','output_total','output_4hourly','cumulated_balance','86','87','88','89','90','91','SOFA','SIRS']
    //
    // records = [['1.0','31326208.0','5221635480.0','1.0','74.0','2.0','0.0','1.0','1.0','1.0','24.23333333333333','62.0','70.0','15.0','-5.0','117.0','93.0','79.93333333333334','75.4','29.538461538461537','91.92857142857143','37.77777777777778','100.0','16.75','nan','nan','nan','6.5','nan','nan','100.0','1.0','15.0','15.0','400.0','11.6','20.0','57.0','30.125','4.6','110.5','97.0','355.0','87.0','1.7','2.3','8.8','1.12','nan','515.0','47.0','5.011825785982117','3.3','5.5','3.4','0.81','6.7','11.766666666666666','34.892199999999995','nan','3.1','6.0','56.8','19.4','174.66666666666663','1.0','7.36','65.25','30.0','-1.0','1.4','23.0','28.285714285714285','72.0','1.0','0.0','1.2580645161290325','65.25','0.1125','1.7990000000000002','3141.1596833333333','141.15968333333333','45.0','45.0','3096.1596833333333','4.0','4.0','2.0','4.0','0.0','3.0','17.0','3.0'],['2.0','31326208.0','5221649880.0','1.0','74.0','2.0','0.0','1.0','1.0','1.0','24.23333333333333','62.0','70.0','15.0','-5.0','97.0','84.0','80.75','84.55555555555556','28.5','89.85714285714286','37.77777777777778','100.0','18.0','nan','nan','nan','3.157142857142857','nan','nan','100.0','1.0','15.0','15.0','400.0','11.6','20.0','57.0','33.333333333333336','4.6','155.0','97.0','336.7142857142857','87.0','1.7','2.3','8.8','1.17','nan','515.0','47.0','5.011825785982117','3.3','5.5','3.4','0.81','6.7','11.966666666666667','35.4646','nan','3.1','6.0','56.8','19.4','174.66666666666663','1.0','7.36','63.0','44.0','-1.0','3.9','23.0','28.0','72.0','1.0','0.0','1.1547619047619049','63.0','0.8845','2.432','5568.944466666668','2427.784783333333','85.0','40.0','5483.944466666667','4.0','4.0','2.0','4.0','0.0','3.0','17.0','3.0'],['3.0','31326208.0','5221664280.0','1.0','74.0','2.0','0.0','1.0','1.0','1.0','24.23333333333333','62.0','70.0','15.0','-5.0','81.8','102.3','88.6','76.55','28.0','91.22222222222223','37.388888888888886','99.3','23.0','nan','nan','nan','3.157142857142857','nan','nan','100.0','1.0','15.0','15.0','400.0','11.6','20.0','57.0','28.2','4.6','155.0','105.0','326.2','87.0','1.7','2.3','8.8','1.17','nan','515.0','47.0','5.011825785982117','3.3','5.5','3.4','0.81','6.7','12.1','35.8462','nan','3.1','6.0','56.8','19.4','174.66666666666663','1.0','7.36','62.3','44.0','-1.0','1.4','23.0','28.0','72.0','1.0','0.0','0.7996089931573802','62.3','0.25','2.432','7526.804533333334','1957.8600666666666','115.0','30.0','7411.804533333334','4.0','4.0','2.0','4.0','0.0','4.0','18.0','2.0'],['4.0','31326208.0','5221678680.0','1.0','74.0','2.0','0.0','1.0','1.0','1.0','24.23333333333333','62.0','70.0','15.0','-5.0','98.41666666666669','51.25','88.0','107.91666666666669','26.0','93.83333333333331','37.388888888888886','99.3','23.0','nan','nan','nan','3.157142857142857','nan','nan','100.0','1.0','15.0','15.0','400.0','11.6','20.0','50.6','48.0','4.6','155.0','108.0','367.08333333333326','87.0','1.7','2.3','8.8','1.17','nan','515.0','47.0','5.011825785982117','3.3','5.5','3.4','0.81','6.7','12.1','35.8462','nan','3.1','6.0','56.8','19.4','174.66666666666663','1.0','7.36','92.33333333333331','44.0','-1.0','3.9','23.0','24.0','72.0','1.0','0.0','1.9203252032520328','92.33333333333331','1.585','2.249','8012.869600000001','486.06506666666667','195.0','80.0','7817.869600000001','4.0','4.0','2.0','4.0','0.0','3.0','17.0','3.0'],['5.0','31326208.0','5221693080.0','1.0','74.0','2.0','0.0','1.0','1.0','1.0','24.23333333333333','72.0','70.0','15.0','-5.0','107.76923076923076','97.23076923076924','87.61538461538461','74.80769230769229','24.923076923076927','91.76923076923076','37.77777777777778','100.0','23.0','nan','nan','nan','3.157142857142857','nan','nan','100.0','1.0','15.0','15.0','400.0','11.6','20.0','50.846153846153854','48.0','4.6','155.0','102.0','387.5384615384616','87.0','1.7','2.3','8.8','1.12','nan','515.0','47.0','5.011825785982117','3.3','5.5','3.4','0.81','6.7','10.1','30.122200000000007','nan','3.1','6.0','56.8','19.4','185.0','1.0','7.36','98.76923076923076','44.0','-1.0','1.4','19.0','28.285714285714285','72.0','1.0','0.0','1.1083860759493671','98.76923076923076','1.358','2.055','10557.1454','2544.2758','330.0','135.0','10227.1454','4.0','4.0','2.0','4.0','0.0','1.0','15.0','3.0'],['6.0','31326208.0','5221707480.0','1.0','74.0','2.0','0.0','1.0','1.0','1.0','24.23333333333333','72.0','70.0','15.0','-5.0','117.0','99.28','90.13333333333334','81.36','27.68','84.96','37.77777777777778','100.0','23.0','nan','nan','nan','6.5','nan','nan','92.4','0.924','15.0','15.0','400.0','11.6','20.0','49.96','48.0','4.6','110.5','102.0','423.24','87.0','1.7','2.3','8.8','1.12','nan','515.0','47.0','5.011825785982117','3.3','5.5','3.4','0.81','6.7','9.1','27.2602','nan','3.1','6.0','56.8','19.4','185.0','1.0','7.36','79.08','21.66666666666667','-1.0','1.4','19.0','28.285714285714285','72.0','1.0','0.0','1.1784850926672041','85.58441558441558','0.5515','1.641','12339.81245','1782.6670500000002','530.0','200.0','11809.81245','4.0','4.0','2.0','4.0','0.0','1.0','15.0','3.0'],['7.0','31326208.0','5221721880.0','1.0','74.0','2.0','0.0','1.0','1.0','1.0','24.23333333333333','72.0','70.0','15.0','-5.0','114.0909090909091','93.1818181818182','77.93939393939394','70.36363636363636','28.0','82.0','36.111111111111114','97.0','23.0','nan','nan','nan','6.5','nan','nan','94.54545454545456','0.9454545454545454','15.0','15.0','400.0','11.6','20.0','53.57142857142857','30.125','4.6','110.5','98.66666666666669','362.8181818181818','87.0','1.7','2.3','8.8','1.12','nan','515.0','47.0','5.011825785982117','3.3','5.5','3.4','0.81','6.7','9.1','27.2602','nan','3.1','6.0','56.8','19.4','180.75','1.0','7.36','69.9090909090909','30.0','-1.0','1.4','19.0','19.0','72.0','1.0','0.0','1.224390243902439','73.94230769230771','0.3','1.349','14475.045483333335','2135.233033333333','620.0','90.0','13855.045483333335','4.0','4.0','2.0','4.0','0.0','1.0','15.0','3.0']]

    dataset = null;
    recordsIndex = { 'MIMIC-IV': null };
    detailIndex = { 'MIMIC-IV': null };
    recordsState = { 'MIMIC-IV': null };

    initGraphReady = true;
    recordIndexReady = false;
    detailIndexReady = false;
    recordStateReady = false;
    initData = (dataset = 'MIMIC-IV', initialRecord = undefined) => {
        if (!!initialRecord) {
            this.initGraphReady = false;
        }
        this.dataset = dataset;

        const getGraphInit = () => get('/graph/init', { actionslimit: this.actionsLimit, record: initialRecord }, res => {
            console.log(res)
            if (res.succeed) {
                this.loadGraph(res.graph);
            } else {
                console.log(res.info);
            }
        })

        if (this.recordsIndex['MIMIC-IV'] === null) {
            get('/records/get_index', null, res => {
                console.log(res)
                if (res.succeed) {
                    this.recordsIndex['MIMIC-IV'] = res.records_index;
                    this.recordIndexReady = true;
                    if (this.detailIndex['MIMIC-IV'] === null) {
                        get('/records/detail_index', null, res => {
                            console.log(res)
                            if (res.succeed) {
                                this.detailIndex['MIMIC-IV'] = res.details_index //.slice(0,2).concat(res.details_index.slice(3,5));
                                this.detailIndexReady = true;
                                get('/records/init', null, res => {
                                    console.log(res);
                                    if (res.succeed) {
                                        this.recordsState['MIMIC-IV'] = res.records;
                                        this.recordStateReady = true;
                                        this.filterInit()
                                    }
                                })
                            } else {
                                console.log(res.info);
                            }
                        })
                    }

                } else {
                    console.log(res.info);
                }
            })
        }

        if (!!initialRecord) {
            getGraphInit();
        }
    };

    expandActionNode = (expandNodeId, expandNodeActionId) => {
        this.initGraphReady = false;
        get('/graph/expand', { actionslimit: this.actionsLimit, expandnodeid: expandNodeId, expandnodeactionid: expandNodeActionId }, res => {
            console.log(res)
            if (res.succeed) {
                this.loadGraph(res.graph);
            } else {
                console.log(res.info);
            }
        })
    }
    unexpandActionNode = (expandNodeId, expandNodeActionId) => {
        this.initGraphReady = false;
        get('/graph/unexpand', { actionslimit: this.actionsLimit, expandnodeid: expandNodeId, expandnodeactionid: expandNodeActionId }, res => {
            console.log(res)
            if (res.succeed) {
                this.loadGraph(res.graph);
            } else {
                console.log(res.info);
            }
        })
    }
    showAction = (expandNodeId) => {
        this.initGraphReady = false;
        get('/graph/show_actions', { actionslimit: this.actionsLimit, expandnodeid: expandNodeId }, res => {
            console.log(res)
            if (res.succeed) {
                this.loadGraph(res.graph);
            } else {
                console.log(res.info);
            }
        })
    }
    hideAction = (expandNodeId) => {
        this.initGraphReady = false;
        get('/graph/hide_actions', { actionslimit: this.actionsLimit, expandnodeid: expandNodeId }, res => {
            console.log(res)
            if (res.succeed) {
                this.loadGraph(res.graph);
            } else {
                console.log(res.info);
            }
        })
    }

    highlightBranchRoot = null;
    hoverBranchRoot = (branchRoot) => {
        this.highlightBranchRoot = branchRoot;
    }
    unhoverBranchRoot = () => { this.highlightBranchRoot = null; }

    // 比较视图
    interestFeatures = ['PaO2_FiO2',
        'SysBP',
        'GCS',
        'WBC_count',
        'Shock_Index',
        'Arterial_BE',
        'Creatinine',
        'Calcium',
        'Platelets_count',
        'input4hourly',
        'output4hourly'];
    setInterestFeatures = (values) => {
        this.interestFeatures = values;
    }
    chosenItems = [];
    chosenAfterItems = [];
    setChosenItem = (node) => {
        if (this.chosenItems.some(item => item.node_id === node.node_id)) {
            this.chosenItems = this.chosenItems.filter(n => n.node_id !== node.node_id);
        } else {
            get('/records/state_pred_record', {state_id: node.state_id}, res => {
                console.log(res);
                if (res.succeed) {
                    this.chosenItems = [{record: res.record, ...node}]
                } else {
                    console.log(res.info);
                }
            })
        }
    }
    setChosenAfterItem = (nodes, action) => {
        const nodeIds = nodes.map(node => node.node_id);

        if (action === -1 || nodeIds.length === 0 || action === undefined) {
            this.chosenAfterItems = []
        }
        else {
            get('/graph/pred_state', {nodeid: nodeIds, nodeaction: action}, res => {
                console.log(res)
                if (res.succeed) {
                    get('/records/state_pred_record', {state_id: res.state}, res => {
                        console.log('/records/state_pred_record', res, res.record[0][0][0])
                        if (res.succeed) {
                            if (res.record[0][0][0] !== undefined) {
                                console.log('res.record', res.record.map(r => ({record: r})))
                                this.chosenAfterItems = res.record.map((r, rid) => ({record: r, mortality: res.status[rid].mortality}));
                            } else {
                                this.chosenAfterItems = [{record: res.record, mortality: res.status.mortality}]
                            }
                        } else {
                            console.log(res.info);
                        }
                    })
                } else {
                    console.log(res.info);
                }
            })
        }
    }

    // filter 视图
    ageRange = [0, 100]
    weightRange = [0, 100]
    age = [0, 100]
    gender = "0"
    weight = [0, 100]
    lengthRange = [0, 100]
    length = [0, 100]
    filterInit = () => {
        get('/records/filter_init', null, res => {
            if (res.succeed) {
                this.ageRange = res['filter_index'].age;
                this.age = res['filter_index'].age;
                this.weightRange = res['filter_index'].weight;
                this.weight = res['filter_index'].weight;
                this.lengthRange = res['filter_index'].length;
                this.length = res['filter_index'].length;
                console.log(res['filter_index'])
            } else {
                console.error(res.info);
            }
        })
    }
    changeGender = v => {
        this.gender = v;
    }
    changeAge = v => {
        this.age = v;
    }
    changeWeight = v => {
        this.weight = v;
    }
    changeLength = v => {
        this.length = v;
    }
    
    filterRecordsIndex = [];
    onFilterSubmit = () => {
        get('/records/filter', { random: 10, weight: this.weight[0] + ',' + this.weight[1], gender: this.gender, age: this.age[0] + ',' + this.age[1], length: this.length[0] + ',' + this.length[1] }, res => {
            console.log('res', res);
            this.filterRecordsIndex = res.records_index;
        });
    }
    onFilterRefresh = () => {
        get('/records/filter_refresh', { random: 10 }, res => {
            console.log('res', res);
            this.filterRecordsIndex = res.records_index;
        })
    }

    stateSequence = null;
    actionSequence = null;
    partOfSequence = [0,1,2];
    setPartOfSequence = (part) => {
        if (this.partOfSequence.includes(part)) {
            this.partOfSequence = this.partOfSequence.filter(p => p !== part);
        } else {
            this.partOfSequence = this.partOfSequence.concat([part]);
        }
    }
    setStateActionSequence = (data, action) => {

        if (!!this.stateSequence && this.stateSequence.node_id === data.node_id && this.actionSequence === action) {
            this.stateSequence = null;
            this.actionSequence = null;
        }

        this.stateSequence = data;
        this.actionSequence = action;
    }
    getSequences = () => {
        console.log(this.stateSequence)
        const occurSequences = [];
        const isPartOfSequence = (this.partOfSequence.slice().sort()).map(v => (len, idx) => idx >= v * len / 3 && idx <= (v + 1) * len / 3);
        if (this.stateSequence === null && this.actionSequence === null) {
            return occurSequences;
        }
        this.recordsState['MIMIC-IV'].forEach((r, rId) => {
            const occurs = r.states.reduce((occurs, _, idx) => {
                if (isPartOfSequence.some(f => f(r.states.length, idx))) {
                    return (r.states[idx] === this.stateSequence.state_id && r.actions[idx] === this.actionSequence) ? occurs.concat(idx) : occurs;
                }
                return occurs;
            }, []);
            if (occurs.length > 0) {
                occurSequences.push({'record': r, 'occur': occurs, rId})
            }
        })
        return occurSequences;
    }
}

const store = new Store();
export default store;
