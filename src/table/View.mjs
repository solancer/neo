import Component from '../component/Base.mjs';

/**
 * @class Neo.table.View
 * @extends Neo.component.Base
 */
class View extends Component {
    static getConfig() {return {
        /**
         * @member {String} className='Neo.table.View'
         * @protected
         */
        className: 'Neo.table.View',
        /**
         * @member {String} ntype='table-view'
         * @protected
         */
        ntype: 'table-view',
        /**
         * @member {Array} cls=['neo-table-view']
         */
        cls: ['neo-table-view'],
        /**
         * @member {String|null} containerId=null
         * @protected
         */
        containerId: null,
        /**
         * @member {Object} recordVnodeMap={}
         */
        recordVnodeMap: {},
        /**
         * @member {Neo.data.Store|null} store=null
         */
        store: null,
        /**
         * @member {Boolean} useRowRecordIds=true
         */
        useRowRecordIds: true,
        /**
         * @member {Object} _vdom={tag: 'tbody', cn : []}
         */
        _vdom:
        {tag: 'tbody', cn: []}
    }}

    /**
     * @param {Array} inputData
     */
    createViewData(inputData) {
        let me         = this,
            amountRows = inputData.length,
            container  = Neo.getComponent(me.parentId),
            hasStore   = container.store && container.store.model, // todo: remove as soon as all tables use stores (examples table)
            columns    = container.items[0].items,
            colCount   = columns.length,
            data       = [],
            i          = 0,
            vdom       = me.vdom,
            cellCls, cellId, config, column, dockLeftMargin, dockRightMargin, id, index, j, rendererOutput, rendererValue, selectedRows, trCls;

        me.recordVnodeMap = {}; // remove old data

        // console.log('createViewData', me.id, inputData);

        if (container.selectionModel.ntype === 'selection-table-rowmodel') {
            selectedRows = container.selectionModel.items || [];
        }

        for (; i < amountRows; i++) {
            if (me.useRowRecordIds) {
                id = me.id + '-tr-' + inputData[i][me.store.keyProperty];
            } else {
                id = vdom.cn[i] && vdom.cn[i].id || Neo.getId('tr');
            }

            me.recordVnodeMap[id] = i;

            trCls = me.getTrClass(inputData[i], i);

            if (selectedRows && selectedRows.includes(id)) {
                trCls.push('neo-selected');
            }

            data.push({
                tag     : 'tr',
                id      : id,
                cls     : trCls,
                cn      : [],
                tabIndex: '-1'
            });

            dockLeftMargin  = 0;
            dockRightMargin = 0;

            j = 0;

            for (; j < colCount; j++) {
                column         = columns[j];
                rendererValue  = inputData[i][column.dataField];

                if (rendererValue === undefined) {
                    rendererValue = '';
                }

                rendererOutput = column.renderer.call(column.rendererScope || container, {
                    dataField: column.dataField,
                    index    : i,
                    record   : inputData[i],
                    value    : rendererValue
                });

                cellCls = rendererOutput.cls || ['neo-table-cell'];

                if (column.align !== 'left') {
                    cellCls.push('neo-' + column.align);
                }

                if (!Neo.isObject(rendererOutput)) {
                    rendererOutput = {
                        cls : cellCls,
                        html: rendererOutput.toString()
                    };
                }

                // todo: remove the if part as soon as all tables use stores (examples table)
                if (hasStore) {
                    cellId = me.getCellId(inputData[i], column.dataField);
                } else {
                    cellId = vdom.cn[i] && vdom.cn[i].cn[j] && vdom.cn[i].cn[j].id || Neo.getId('td');
                }

                config = {
                    tag      : 'td',
                    id       : cellId,
                    cls      : rendererOutput.cls   || ['neo-table-cell'],
                    innerHTML: rendererOutput.html  || '',
                    style    : rendererOutput.style || {},
                    tabIndex : '-1'
                };

                if (column.dock) {
                    config.cls = ['neo-locked', ...config.cls || []];

                    if (column.dock === 'left') {
                        config.style.left = dockLeftMargin + 'px';
                        dockLeftMargin += (column.width + 1); // todo: borders fix
                    }
                }

                data[i].cn.push(config);
            }

            j = 0;

            for (; j < colCount; j++) {
                index  = colCount - j -1;
                column = columns[index];

                if (column.dock === 'right') {
                    data[i].cn[index].style.right = dockRightMargin + 'px';
                    dockRightMargin += (column.width + 1); // todo: borders fix
                }
            }
        }

        vdom.cn = data;

        container.dockLeftMargin  = dockLeftMargin;
        container.dockRightMargin = dockRightMargin;

        me.vdom = vdom;
    }

    /**
     *
     * @param {Boolean} updateParentVdom
     * @param {Boolean} silent
     */
    destroy(updateParentVdom, silent) {
        this.store = null;
        super.destroy(updateParentVdom, silent);
    }

    /**
     *
     * @param {Object} record
     * @param {String} dataField
     * @returns {String}
     */
    getCellId(record, dataField) {
        return this.id + '__' + record[this.store.keyProperty] + '__' + dataField;
    }

    /**
     * Override this method to apply custom CSS rules to table rows
     * @param {Object} record
     * @param {Number} rowIndex
     * @returns {String[]}
     */
    getTrClass(record, rowIndex) {
        return ['neo-table-row'];
    }

    /**
     * Gets triggered after changing the value of a record field.
     * E.g. myRecord.foo = 'bar';
     * @param {Object} opts
     * @param {String} opts.field The name of the field which got changed
     * @param {Neo.data.Model} opts.model The model instance of the changed record
     * @param {*} opts.oldValue
     * @param {Object} opts.record
     * @param {*} opts.value
     */
    onStoreRecordChange(opts) {
        let me       = this,
            cellId   = me.getCellId(opts.record, opts.field),
            cellNode = me.getVdomChild(cellId);

        cellNode.innerHTML = opts.value; // keep the vdom in sync

        Neo.currentWorker.promiseMessage('main', {
            action: 'updateDom',
            deltas: [{
                id       : cellId,
                innerHTML: opts.value
            }]
        });
    }
}

Neo.applyClassConfig(View);

export {View as default};