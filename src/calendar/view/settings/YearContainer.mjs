import CheckBoxField from '../../../form/field/CheckBox.mjs';
import Container     from '../../../container/Base.mjs';
import RadioField    from '../../../form/field/Radio.mjs';

/**
 * @class Neo.calendar.view.settings.YearContainer
 * @extends Neo.container.Base
 */
class YearContainer extends Container {
    static getConfig() {return {
        /**
         * @member {String} className='Neo.calendar.view.settings.YearContainer'
         * @protected
         */
        className: 'Neo.calendar.view.settings.YearContainer',
        /**
         * @member {Object} layout={ntype:'vbox',align:'stretch'}
         */
        layout: {ntype: 'vbox', align: 'stretch'}
    }}

    /**
     *
     * @param {Object} config
     */
    constructor(config) {
        super(config);
        this.createItems();
    }

    /**
     *
     */
    createItems() {
        let me            = this,
            labelWidth    = 160,
            yearComponent = me.getYearComponent();

        me.items = [{
            module        : RadioField,
            checked       : yearComponent.monthNameFormat === 'short',
            fieldValue    : 'short',
            flex          : 'none',
            hideValueLabel: false,
            labelText     : 'monthNameFormat',
            labelWidth    : labelWidth,
            listeners     : {change: me.onRadioChange, scope: me},
            name          : 'monthNameFormat',
            valueLabelText: 'short'
        }, {
            module        : RadioField,
            checked       : yearComponent.monthNameFormat === 'long',
            fieldValue    : 'long',
            flex          : 'none',
            hideValueLabel: false,
            labelText     : '',
            labelWidth    : labelWidth,
            listeners     : {change: me.onRadioChange, scope: me},
            name          : 'monthNameFormat',
            style         : {marginTop: '5px'},
            valueLabelText: 'long'
        }, {
            module    : CheckBoxField,
            checked   : yearComponent.showCellBorders,
            flex      : 'none',
            labelText : 'showCellBorders',
            labelWidth: labelWidth,
            listeners : {change: me.onConfigChange, scope: me},
            name      : 'showCellBorders',
            style     : {marginTop: '10px'}
        }, {
            module    : CheckBoxField,
            checked   : yearComponent.showWeekNumbers,
            flex      : 'none',
            labelText : 'showWeekNumbers',
            labelWidth: labelWidth,
            listeners : {change: me.onConfigChange, scope: me},
            name      : 'showWeekNumbers',
            style     : {marginTop: '10px'}
        }, {
            module    : CheckBoxField,
            checked   : yearComponent.sixWeeksPerMonth,
            flex      : 'none',
            labelText : 'sixWeeksPerMonth',
            labelWidth: labelWidth,
            listeners : {change: me.onConfigChange, scope: me},
            name      : 'sixWeeksPerMonth',
            style     : {marginTop: '10px'}
        }];

        super.createItems();
    }

    /**
     *
     * @returns {Neo.calendar.view.YearComponent}
     */
    getYearComponent() {
        return this.up('calendar-maincontainer').yearComponent;
    }

    /**
     *
     * @param {Object} data
     */
    onRadioChange(data) {
        if (data.value) {
            this.getYearComponent()[data.component.name] = data.component.fieldValue;
        }
    }

    /**
     *
     * @param {Object} data
     */
    onConfigChange(data) {
        this.getYearComponent()[data.component.name] = data.value;
    }
}

Neo.applyClassConfig(YearContainer);

export {YearContainer as default};