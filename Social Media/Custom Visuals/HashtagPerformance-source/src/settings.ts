"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

class HeaderCardSettings extends FormattingSettingsCard {
    title = new formattingSettings.TextInput({
        name: "title",
        displayName: "Title",
        value: "Hashtag Performance",
        placeholder: "Title"
    });

    subtitle = new formattingSettings.TextInput({
        name: "subtitle",
        displayName: "Subtitle",
        value: "Top tags by engagement rate — impressions per post as bar",
        placeholder: "Subtitle"
    });

    showIcon = new formattingSettings.ToggleSwitch({
        name: "showIcon",
        displayName: "Show # icon",
        value: true
    });

    name: string = "header";
    displayName: string = "Header";
    slices: Array<FormattingSettingsSlice> = [this.title, this.subtitle, this.showIcon];
}

class DataPointCardSettings extends FormattingSettingsCard {
    barColorStart = new formattingSettings.ColorPicker({
        name: "barColorStart",
        displayName: "Bar color (start)",
        value: { value: "#ec5fa3" }
    });

    barColorEnd = new formattingSettings.ColorPicker({
        name: "barColorEnd",
        displayName: "Bar color (end)",
        value: { value: "#c026a3" }
    });

    barTrackColor = new formattingSettings.ColorPicker({
        name: "barTrackColor",
        displayName: "Bar track color",
        value: { value: "#e9e3f5" }
    });

    hashtagColor = new formattingSettings.ColorPicker({
        name: "hashtagColor",
        displayName: "Hashtag text color",
        value: { value: "#c026a3" }
    });

    positiveColor = new formattingSettings.ColorPicker({
        name: "positiveColor",
        displayName: "CTR text color",
        value: { value: "#1a9850" }
    });

    impressionsColor = new formattingSettings.ColorPicker({
        name: "impressionsColor",
        displayName: "Avg Impressions text color",
        value: { value: "#4b4a52" }
    });

    engRateColor = new formattingSettings.ColorPicker({
        name: "engRateColor",
        displayName: "Eng. Rate text color",
        value: { value: "#4b4a52" }
    });

    clicksColor = new formattingSettings.ColorPicker({
        name: "clicksColor",
        displayName: "Clicks text color",
        value: { value: "#4b4a52" }
    });

    hashtagFontSize = new formattingSettings.NumUpDown({
        name: "hashtagFontSize",
        displayName: "Hashtag font size",
        value: 12
    });

    impressionsFontSize = new formattingSettings.NumUpDown({
        name: "impressionsFontSize",
        displayName: "Avg Impressions font size",
        value: 12
    });

    engRateFontSize = new formattingSettings.NumUpDown({
        name: "engRateFontSize",
        displayName: "Eng. Rate font size",
        value: 12
    });

    clicksFontSize = new formattingSettings.NumUpDown({
        name: "clicksFontSize",
        displayName: "Clicks font size",
        value: 12
    });

    ctrFontSize = new formattingSettings.NumUpDown({
        name: "ctrFontSize",
        displayName: "CTR font size",
        value: 12
    });

    name: string = "dataPoint";
    displayName: string = "Data colors";
    slices: Array<FormattingSettingsSlice> = [
        this.barColorStart, this.barColorEnd, this.barTrackColor,
        this.hashtagColor, this.positiveColor,
        this.impressionsColor, this.engRateColor, this.clicksColor,
        this.hashtagFontSize, this.impressionsFontSize, this.engRateFontSize,
        this.clicksFontSize, this.ctrFontSize
    ];
}

class ColumnHeaderCardSettings extends FormattingSettingsCard {
    hashtagHeaderColor = new formattingSettings.ColorPicker({
        name: "hashtagHeaderColor",
        displayName: "Hashtag header color",
        value: { value: "#9a97a4" }
    });

    hashtagHeaderFontSize = new formattingSettings.NumUpDown({
        name: "hashtagHeaderFontSize",
        displayName: "Hashtag header font size",
        value: 9
    });

    impressionsHeaderColor = new formattingSettings.ColorPicker({
        name: "impressionsHeaderColor",
        displayName: "Avg Impressions header color",
        value: { value: "#9a97a4" }
    });

    impressionsHeaderFontSize = new formattingSettings.NumUpDown({
        name: "impressionsHeaderFontSize",
        displayName: "Avg Impressions header font size",
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

    clicksHeaderColor = new formattingSettings.ColorPicker({
        name: "clicksHeaderColor",
        displayName: "Clicks header color",
        value: { value: "#9a97a4" }
    });

    clicksHeaderFontSize = new formattingSettings.NumUpDown({
        name: "clicksHeaderFontSize",
        displayName: "Clicks header font size",
        value: 9
    });

    ctrHeaderColor = new formattingSettings.ColorPicker({
        name: "ctrHeaderColor",
        displayName: "CTR header color",
        value: { value: "#9a97a4" }
    });

    ctrHeaderFontSize = new formattingSettings.NumUpDown({
        name: "ctrHeaderFontSize",
        displayName: "CTR header font size",
        value: 9
    });

    name: string = "columnHeader";
    displayName: string = "Column Headers";
    slices: Array<FormattingSettingsSlice> = [
        this.hashtagHeaderColor, this.hashtagHeaderFontSize,
        this.impressionsHeaderColor, this.impressionsHeaderFontSize,
        this.engRateHeaderColor, this.engRateHeaderFontSize,
        this.clicksHeaderColor, this.clicksHeaderFontSize,
        this.ctrHeaderColor, this.ctrHeaderFontSize
    ];
}

class SortOrderCardSettings extends FormattingSettingsCard {
    sortBy = new formattingSettings.ItemDropdown({
        name: "sortBy",
        displayName: "Sort by",
        items: [
            { value: "engRate", displayName: "Eng. Rate" },
            { value: "impressions", displayName: "Avg Impressions" },
            { value: "clicks", displayName: "Clicks" },
            { value: "ctr", displayName: "CTR" }
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
