"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

class HeaderCardSettings extends FormattingSettingsCard {
    title = new formattingSettings.TextInput({
        name: "title",
        displayName: "Title",
        value: "Best Performing Posts",
        placeholder: "Title"
    });

    subtitle = new formattingSettings.TextInput({
        name: "subtitle",
        displayName: "Subtitle",
        value: "Top posts in view, ranked by engagement rate",
        placeholder: "Subtitle"
    });

    showIcon = new formattingSettings.ToggleSwitch({
        name: "showIcon",
        displayName: "Show icon",
        value: true
    });

    name: string = "header";
    displayName: string = "Header";
    slices: Array<FormattingSettingsSlice> = [this.title, this.subtitle, this.showIcon];
}

class DataPointCardSettings extends FormattingSettingsCard {
    postColor = new formattingSettings.ColorPicker({
        name: "postColor",
        displayName: "Post text color",
        value: { value: "#4b4a52" }
    });

    postFontSize = new formattingSettings.NumUpDown({
        name: "postFontSize",
        displayName: "Post font size",
        value: 12
    });

    platformColor = new formattingSettings.ColorPicker({
        name: "platformColor",
        displayName: "Platform text color",
        value: { value: "#4b4a52" }
    });

    platformFontSize = new formattingSettings.NumUpDown({
        name: "platformFontSize",
        displayName: "Platform font size",
        value: 12
    });

    contentCategoryColor = new formattingSettings.ColorPicker({
        name: "contentCategoryColor",
        displayName: "Content category color",
        value: { value: "#4f46e5" }
    });

    contentTypeColor = new formattingSettings.ColorPicker({
        name: "contentTypeColor",
        displayName: "Content type color",
        value: { value: "#9a97a4" }
    });

    contentFontSize = new formattingSettings.NumUpDown({
        name: "contentFontSize",
        displayName: "Content font size",
        value: 12
    });

    engRateColor = new formattingSettings.ColorPicker({
        name: "engRateColor",
        displayName: "Eng. Rate text color",
        value: { value: "#1a9850" }
    });

    engRateFontSize = new formattingSettings.NumUpDown({
        name: "engRateFontSize",
        displayName: "Eng. Rate font size",
        value: 12
    });

    engagementsColor = new formattingSettings.ColorPicker({
        name: "engagementsColor",
        displayName: "Engagements text color",
        value: { value: "#4b4a52" }
    });

    engagementsFontSize = new formattingSettings.NumUpDown({
        name: "engagementsFontSize",
        displayName: "Engagements font size",
        value: 12
    });

    reachColor = new formattingSettings.ColorPicker({
        name: "reachColor",
        displayName: "Reach text color",
        value: { value: "#4b4a52" }
    });

    reachFontSize = new formattingSettings.NumUpDown({
        name: "reachFontSize",
        displayName: "Reach font size",
        value: 12
    });

    name: string = "dataPoint";
    displayName: string = "Data colors";
    slices: Array<FormattingSettingsSlice> = [
        this.postColor, this.postFontSize,
        this.platformColor, this.platformFontSize,
        this.contentCategoryColor, this.contentTypeColor, this.contentFontSize,
        this.engRateColor, this.engRateFontSize,
        this.engagementsColor, this.engagementsFontSize,
        this.reachColor, this.reachFontSize
    ];
}

class ColumnHeaderCardSettings extends FormattingSettingsCard {
    postHeaderColor = new formattingSettings.ColorPicker({
        name: "postHeaderColor",
        displayName: "Post header color",
        value: { value: "#9a97a4" }
    });

    postHeaderFontSize = new formattingSettings.NumUpDown({
        name: "postHeaderFontSize",
        displayName: "Post header font size",
        value: 9
    });

    platformHeaderColor = new formattingSettings.ColorPicker({
        name: "platformHeaderColor",
        displayName: "Platform header color",
        value: { value: "#9a97a4" }
    });

    platformHeaderFontSize = new formattingSettings.NumUpDown({
        name: "platformHeaderFontSize",
        displayName: "Platform header font size",
        value: 9
    });

    contentHeaderColor = new formattingSettings.ColorPicker({
        name: "contentHeaderColor",
        displayName: "Content header color",
        value: { value: "#9a97a4" }
    });

    contentHeaderFontSize = new formattingSettings.NumUpDown({
        name: "contentHeaderFontSize",
        displayName: "Content header font size",
        value: 9
    });

    engRateHeaderColor = new formattingSettings.ColorPicker({
        name: "engRateHeaderColor",
        displayName: "Eng. Rate header color",
        value: { value: "#9a97a4" }
    });

    engRateHeaderFontSize = new formattingSettings.NumUpDown({
        name: "engRateHeaderFontSize",
        displayName: "Eng. Rate header font size",
        value: 9
    });

    engagementsHeaderColor = new formattingSettings.ColorPicker({
        name: "engagementsHeaderColor",
        displayName: "Engagements header color",
        value: { value: "#9a97a4" }
    });

    engagementsHeaderFontSize = new formattingSettings.NumUpDown({
        name: "engagementsHeaderFontSize",
        displayName: "Engagements header font size",
        value: 9
    });

    reachHeaderColor = new formattingSettings.ColorPicker({
        name: "reachHeaderColor",
        displayName: "Reach header color",
        value: { value: "#9a97a4" }
    });

    reachHeaderFontSize = new formattingSettings.NumUpDown({
        name: "reachHeaderFontSize",
        displayName: "Reach header font size",
        value: 9
    });

    name: string = "columnHeader";
    displayName: string = "Column Headers";
    slices: Array<FormattingSettingsSlice> = [
        this.postHeaderColor, this.postHeaderFontSize,
        this.platformHeaderColor, this.platformHeaderFontSize,
        this.contentHeaderColor, this.contentHeaderFontSize,
        this.engRateHeaderColor, this.engRateHeaderFontSize,
        this.engagementsHeaderColor, this.engagementsHeaderFontSize,
        this.reachHeaderColor, this.reachHeaderFontSize
    ];
}

class SortOrderCardSettings extends FormattingSettingsCard {
    sortBy = new formattingSettings.ItemDropdown({
        name: "sortBy",
        displayName: "Sort by",
        items: [
            { value: "engRate", displayName: "Eng. Rate" },
            { value: "engagements", displayName: "Engagements" },
            { value: "reach", displayName: "Reach" }
        ],
        value: { value: "engRate", displayName: "Eng. Rate" }
    });

    topN = new formattingSettings.NumUpDown({
        name: "topN",
        displayName: "Rows to show",
        value: 10
    });

    name: string = "sortOrder";
    displayName: string = "Sort & rank";
    slices: Array<FormattingSettingsSlice> = [this.sortBy, this.topN];
}

export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    headerCard = new HeaderCardSettings();
    dataPointCard = new DataPointCardSettings();
    columnHeaderCard = new ColumnHeaderCardSettings();
    sortOrderCard = new SortOrderCardSettings();

    cards = [this.headerCard, this.dataPointCard, this.columnHeaderCard, this.sortOrderCard];
}
