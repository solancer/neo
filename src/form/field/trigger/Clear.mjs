import Base     from './Base.mjs';
import NeoArray from '../../../util/Array.mjs';

/**
 * Clear Trigger to remove the input value of TextFields or subclasses
 * @class Neo.form.field.trigger.Clear
 * @extends Neo.form.field.trigger.Base
 */
class Clear extends Base {
    static getConfig() {return {
        /**
         * @member {String} className='Neo.form.field.trigger.Clear'
         * @protected
         */
        className: 'Neo.form.field.trigger.Clear',
        /**
         * @member {String} ntype='trigger-clear'
         * @protected
         */
        ntype: 'trigger-clear',
        /**
         * @member {String[]} cls=['neo-field-trigger', 'neo-trigger-clear']
         */
        cls: ['neo-field-trigger', 'neo-trigger-clear'],
        /**
         * @member {String|null} iconCls='fa fa-times'
         */
        iconCls: 'fa fa-times',
        /**
         * Internal flag used by field.getTrigger()
         * @member {String} type='clear'
         * @protected
         */
        type: 'clear',
        /**
         * @member {Number} weight_=20
         */
        weight: 20
    }}

    /**
     * Triggered after the hidden config got changed
     * @param {Boolean} value
     * @param {Boolean} oldValue
     * @protected
     */
    afterSetHidden(value, oldValue) {
        let cls = this.cls;

        NeoArray[value ? 'add' : 'remove'](cls, 'neo-is-hidden');
        this.cls = cls;
    }

    /**
     * Triggered before the hidden config gets changed.
     * @param {Boolean} value
     * @param {Boolean} oldValue
     * @protected
     */
    beforeSetHidden(value, oldValue) {
        if (this.showOnHover && !this.isHovered) {
            return true;
        }

        return value;
    }

    /**
     *
     * @param {Boolean} updateParentVdom
     * @param {Boolean} silent
     */
    destroy(updateParentVdom, silent) {
        let me = this;

        me.field.un({
            change                    : me.onFieldChange,
            changeClearToOriginalValue: me.onFieldChange,
            scope                     : me
        });

        super.destroy(updateParentVdom, silent);
    }

    /**
     *
     * @returns {Boolean} true in case the trigger should be hidden
     */
    getHiddenState() {
        let me    = this,
            field = me.field,
            value = field.value;

        if (field.clearToOriginalValue) {
            return value === field.originalConfig.value;
        } else {
            if (value === 0) {
                value = '0';
            }

            return !field.value || value.toString().length < 1;
        }
    }

    /**
     *
     * @param {Object} opts
     */
    onFieldChange(opts) {
        this.hidden = this.getHiddenState();
    }

    /**
     *
     */
    onConstructed() {
        super.onConstructed();

        let me = this;

        me.field.on({
            change                    : me.onFieldChange,
            changeClearToOriginalValue: me.onFieldChange,
            scope                     : me
        });

        me.hidden = me.getHiddenState();
    }

    /**
     * @override
     */
    onMouseEnter() {
        let me = this;

        me.isHovered = true;
        me.hidden    = me.getHiddenState();
    }

    /**
     *
     * @param {Object} data
     */
    onTriggerClick(data) {
        this.field.clear();
    }
}

Neo.applyClassConfig(Clear);

export {Clear as default};
