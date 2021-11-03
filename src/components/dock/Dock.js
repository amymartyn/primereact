import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { classNames, ObjectUtils } from '../utils/Utils';
import { Ripple } from '../ripple/Ripple';

export class Dock extends Component {

    static defaultProps = {
        id: null,
        style: null,
        className: null,
        model: null,
        position: 'bottom',
        magnification: true,
        header: null,
        footer: null
    };

    static propTypes = {
        id: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        model: PropTypes.array,
        position: PropTypes.string,
        magnification: PropTypes.bool,
        header: PropTypes.any,
        footer: PropTypes.any
    };

    constructor(props) {
        super(props);

        this.state = {
            currentIndex: -3
        };

        this.onListMouseLeave = this.onListMouseLeave.bind(this);
    }

    onListMouseLeave() {
        this.setState({ currentIndex: -3 });
    }

    onItemMouseEnter(index) {
        this.setState({ currentIndex: index });
    }

    onItemClick(e, item) {
        if (item.command) {
            item.command({ originalEvent: e, item });
        }

        e.preventDefault();
    }

    renderItem(item, index) {
        const { disabled, icon: _icon, label, template, url, target } = item;
        const className = classNames('p-dock-item', {
            'p-dock-item-second-prev': (this.state.currentIndex - 2) === index,
            'p-dock-item-prev': (this.state.currentIndex - 1) === index,
            'p-dock-item-current': this.state.currentIndex === index,
            'p-dock-item-next': (this.state.currentIndex + 1) === index,
            'p-dock-item-second-next': (this.state.currentIndex + 2) === index
        });
        const contentClassName = classNames('p-dock-action', { 'p-disabled': disabled });
        const iconClassName = classNames('p-dock-action-icon', _icon);
        const icon = typeof _icon === 'string' ? <span className={iconClassName}></span> : ObjectUtils.getJSXElement(_icon, this.props);

        let content = (
            <a href={url || '#'} role="menuitem" className={contentClassName} target={target} data-pr-tooltip={label} onClick={(e) => this.onItemClick(e, item)}>
                {icon}
                <Ripple />
            </a>
        );

        if (template) {
            const defaultContentOptions = {
                onClick: (e) => this.onItemClick(e, item),
                className: contentClassName,
                iconClassName,
                element: content,
                props: this.props,
                index
            };

            content = ObjectUtils.getJSXElement(template, item, defaultContentOptions);
        }

        return (
            <li key={index} className={className} role="none" onMouseEnter={() => this.onItemMouseEnter(index)}>
                {content}
            </li>
        )
    }

    renderItems() {
        if (this.props.model) {
            return this.props.model.map((item, index) => this.renderItem(item, index));
        }

        return null;
    }

    renderHeader() {
        if (this.props.header) {
            return (
                <div className="p-dock-header">
                    {ObjectUtils.getJSXElement(this.props.header, { props: this.props })}
                </div>
            )
        }

        return null;
    }

    renderList() {
        const items = this.renderItems();

        return (
            <ul ref={(el) => this.list = el} className="p-dock-list" role="menu" onMouseLeave={this.onListMouseLeave}>
                {items}
            </ul>
        )
    }

    renderFooter() {
        if (this.props.footer) {
            return (
                <div className="p-dock-footer">
                    {ObjectUtils.getJSXElement(this.props.footer, { props: this.props })}
                </div>
            )
        }

        return null;
    }

    render() {
        const className = classNames(`p-dock p-component p-dock-${this.props.position}`, {
            'p-dock-magnification': this.props.magnification
        }, this.props.className);
        const header = this.renderHeader();
        const list = this.renderList();
        const footer = this.renderFooter();

        return (
            <div id={this.props.id} className={className} style={this.props.style}>
                <div className="p-dock-container">
                    {header}
                    {list}
                    {footer}
                </div>
            </div>
        );
    }
}
