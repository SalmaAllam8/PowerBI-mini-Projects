"use strict";

import powerbi from "powerbi-visuals-api";
import * as d3 from "d3";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import IVisualEventService = powerbi.extensibility.IVisualEventService;
import DataView = powerbi.DataView;

import { VisualFormattingSettingsModel } from "./settings";

interface HashtagRow {
    hashtag: string;
    impressions: number;
    engRate: number;
    clicks: number;
    ctr: number;
}

function formatK(value: number): string {
    if (value === null || value === undefined || isNaN(value)) return "-";
    const thousands = value / 1000;
    return thousands.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + "K";
}

function formatPct(value: number): string {
    if (value === null || value === undefined || isNaN(value)) return "-";
    return value.toFixed(1) + "%";
}

export class Visual implements IVisual {
    private events: IVisualEventService;
    private target: HTMLElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    private root: d3.Selection<HTMLDivElement, unknown, null, undefined>;
    private headerTitle: d3.Selection<HTMLDivElement, unknown, null, undefined>;
    private headerSubtitle: d3.Selection<HTMLDivElement, unknown, null, undefined>;
    private headerIcon: d3.Selection<HTMLDivElement, unknown, null, undefined>;
    private tableBody: d3.Selection<HTMLDivElement, unknown, null, undefined>;

    constructor(options: VisualConstructorOptions) {
        this.events = options.host.eventService;
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;

        this.root = d3.select(this.target).append("div").attr("class", "htp-root");

        const headerRow = this.root.append("div").attr("class", "htp-header");
        this.headerIcon = headerRow.append("div").attr("class", "htp-header-icon").text("#");
        const headerText = headerRow.append("div").attr("class", "htp-header-text");
        this.headerTitle = headerText.append("div").attr("class", "htp-title");
        this.headerSubtitle = headerText.append("div").attr("class", "htp-subtitle");

        const colHeader = this.root.append("div").attr("class", "htp-colheader");
        colHeader.append("div").attr("class", "htp-col htp-col-hashtag htp-header-hashtag").text("HASHTAG");
        colHeader.append("div").attr("class", "htp-col htp-col-bar htp-header-impressions").text("AVG IMPRESSIONS");
        colHeader.append("div").attr("class", "htp-col htp-col-num htp-header-engrate").text("ENG. RATE");
        colHeader.append("div").attr("class", "htp-col htp-col-num htp-header-clicks").text("CLICKS");
        colHeader.append("div").attr("class", "htp-col htp-col-num htp-header-ctr").text("CTR");

        this.tableBody = this.root.append("div").attr("class", "htp-body");
    }

    private extractData(dataView: DataView): HashtagRow[] {
        const rows: HashtagRow[] = [];
        if (!dataView || !dataView.categorical || !dataView.categorical.categories || !dataView.categorical.values) {
            return rows;
        }

        const categorical = dataView.categorical;
        const categoryValues = categorical.categories[0].values;
        const valueColumns = categorical.values;

        const findCol = (role: string) => valueColumns.find(v => v.source.roles && v.source.roles[role]);
        const impressionsCol = findCol("impressions");
        const engRateCol = findCol("engRate");
        const clicksCol = findCol("clicks");
        const ctrCol = findCol("ctr");

        for (let i = 0; i < categoryValues.length; i++) {
            rows.push({
                hashtag: String(categoryValues[i]),
                impressions: impressionsCol ? Number(impressionsCol.values[i]) : 0,
                engRate: engRateCol ? Number(engRateCol.values[i]) : 0,
                clicks: clicksCol ? Number(clicksCol.values[i]) : 0,
                ctr: ctrCol ? Number(ctrCol.values[i]) : 0
            });
        }
        return rows;
    }

    public update(options: VisualUpdateOptions) {
        this.events.renderingStarted(options);
        try {
            const dataView = options.dataViews && options.dataViews[0];
            this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(VisualFormattingSettingsModel, dataView);

            const header = this.formattingSettings.headerCard;
            const dp = this.formattingSettings.dataPointCard;
            const sortCard = this.formattingSettings.sortOrderCard;

            this.headerTitle.text(header.title.value);
            this.headerSubtitle.text(header.subtitle.value);
            this.headerIcon.style("display", header.showIcon.value ? "flex" : "none");

            let rows = this.extractData(dataView);

            const sortKey = sortCard.sortBy.value.value as keyof HashtagRow;
            rows.sort((a, b) => (b[sortKey] as number) - (a[sortKey] as number));
            const topN = sortCard.topN.value;
            if (topN && topN > 0) {
                rows = rows.slice(0, topN);
            }

            const maxImpressions = d3.max(rows, r => r.impressions) || 1;

            this.root.style("--htp-bar-start", dp.barColorStart.value.value);
            this.root.style("--htp-bar-end", dp.barColorEnd.value.value);
            this.root.style("--htp-bar-track", dp.barTrackColor.value.value);
            this.root.style("--htp-hashtag-color", dp.hashtagColor.value.value);
            this.root.style("--htp-positive-color", dp.positiveColor.value.value);
            this.root.style("--htp-impressions-color", dp.impressionsColor.value.value);
            this.root.style("--htp-engrate-color", dp.engRateColor.value.value);
            this.root.style("--htp-hashtag-fontsize", dp.hashtagFontSize.value + "px");
            this.root.style("--htp-impressions-fontsize", dp.impressionsFontSize.value + "px");
            this.root.style("--htp-engrate-fontsize", dp.engRateFontSize.value + "px");
            this.root.style("--htp-clicks-fontsize", dp.clicksFontSize.value + "px");
            this.root.style("--htp-ctr-fontsize", dp.ctrFontSize.value + "px");
            this.root.style("--htp-clicks-color", dp.clicksColor.value.value);

            const ch = this.formattingSettings.columnHeaderCard;
            this.root.style("--htp-header-hashtag-color", ch.hashtagHeaderColor.value.value);
            this.root.style("--htp-header-hashtag-fontsize", ch.hashtagHeaderFontSize.value + "px");
            this.root.style("--htp-header-impressions-color", ch.impressionsHeaderColor.value.value);
            this.root.style("--htp-header-impressions-fontsize", ch.impressionsHeaderFontSize.value + "px");
            this.root.style("--htp-header-engrate-color", ch.engRateHeaderColor.value.value);
            this.root.style("--htp-header-engrate-fontsize", ch.engRateHeaderFontSize.value + "px");
            this.root.style("--htp-header-clicks-color", ch.clicksHeaderColor.value.value);
            this.root.style("--htp-header-clicks-fontsize", ch.clicksHeaderFontSize.value + "px");
            this.root.style("--htp-header-ctr-color", ch.ctrHeaderColor.value.value);
            this.root.style("--htp-header-ctr-fontsize", ch.ctrHeaderFontSize.value + "px");

            const rowSel = this.tableBody.selectAll<HTMLDivElement, HashtagRow>(".htp-row")
                .data(rows, (d: HashtagRow) => d.hashtag);

            rowSel.exit().remove();

            const rowEnter = rowSel.enter()
                .append("div")
                .attr("class", "htp-row");

            rowEnter.append("div").attr("class", "htp-col htp-col-hashtag htp-hashtag-text");
            const barCol = rowEnter.append("div").attr("class", "htp-col htp-col-bar");
            barCol.append("div").attr("class", "htp-bar-track")
                .append("div").attr("class", "htp-bar-fill");
            barCol.append("div").attr("class", "htp-bar-label");
            rowEnter.append("div").attr("class", "htp-col htp-col-num htp-eng-rate");
            rowEnter.append("div").attr("class", "htp-col htp-col-num htp-clicks");
            rowEnter.append("div").attr("class", "htp-col htp-col-num htp-ctr");

            const rowMerge = rowEnter.merge(rowSel);

            rowMerge.select(".htp-hashtag-text").text(d => d.hashtag);
            rowMerge.select(".htp-bar-fill")
                .style("width", d => Math.max(2, (d.impressions / maxImpressions) * 100) + "%");
            rowMerge.select(".htp-bar-label").text(d => formatK(d.impressions));
            rowMerge.select(".htp-eng-rate").text(d => formatPct(d.engRate));
            rowMerge.select(".htp-clicks").text(d => formatK(d.clicks));
            rowMerge.select(".htp-ctr").text(d => formatPct(d.ctr));

            this.events.renderingFinished(options);
        }
        catch (error) {
            console.log('Error in update method', error);
            this.events.renderingFailed(options, String(error));
        }
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}
