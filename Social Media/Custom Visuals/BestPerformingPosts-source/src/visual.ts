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

interface PostRow {
    post: string;
    platform: string;
    contentCategory: string;
    contentType: string;
    engRate: number;
    engagements: number;
    reach: number;
}

const PLATFORM_COLORS: { [key: string]: string } = {
    "x.com": "#0f1419",
    "x": "#0f1419",
    "twitter": "#0f1419",
    "youtube": "#ff2b4f",
    "instagram": "#e1306c",
    "tiktok": "#25d0c4",
    "facebook": "#1877f2",
    "linkedin": "#0a66c2",
    "pinterest": "#e60023",
    "snapchat": "#fffc00",
    "threads": "#000000"
};

const FALLBACK_PALETTE = ["#7b3fe4", "#f59e0b", "#10b981", "#ef4444", "#3b82f6"];

function platformColor(platform: string): string {
    const key = (platform || "").trim().toLowerCase();
    if (PLATFORM_COLORS[key]) return PLATFORM_COLORS[key];
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    return FALLBACK_PALETTE[hash % FALLBACK_PALETTE.length];
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

        this.root = d3.select(this.target).append("div").attr("class", "bpp-root");

        const headerRow = this.root.append("div").attr("class", "bpp-header");
        this.headerIcon = headerRow.append("div").attr("class", "bpp-header-icon").text("🏆");
        const headerText = headerRow.append("div").attr("class", "bpp-header-text");
        this.headerTitle = headerText.append("div").attr("class", "bpp-title");
        this.headerSubtitle = headerText.append("div").attr("class", "bpp-subtitle");

        const colHeader = this.root.append("div").attr("class", "bpp-colheader");
        colHeader.append("div").attr("class", "bpp-col bpp-col-post bpp-header-post").text("POST");
        colHeader.append("div").attr("class", "bpp-col bpp-col-platform bpp-header-platform").text("PLATFORM");
        colHeader.append("div").attr("class", "bpp-col bpp-col-content bpp-header-content").text("CONTENT");
        colHeader.append("div").attr("class", "bpp-col bpp-col-num bpp-header-engrate").text("ENG. RATE");
        colHeader.append("div").attr("class", "bpp-col bpp-col-num bpp-header-engagements").text("ENGAGEMENTS");
        colHeader.append("div").attr("class", "bpp-col bpp-col-num bpp-header-reach").text("REACH");

        this.tableBody = this.root.append("div").attr("class", "bpp-body");
    }

    private extractData(dataView: DataView): PostRow[] {
        const rows: PostRow[] = [];
        if (!dataView || !dataView.table || !dataView.table.rows || !dataView.table.columns) {
            return rows;
        }

        const columns = dataView.table.columns;
        const tableRows = dataView.table.rows;

        const findIdx = (role: string) => columns.findIndex(c => c.roles && c.roles[role]);
        const postIdx = findIdx("post");
        const platformIdx = findIdx("platform");
        const contentCategoryIdx = findIdx("contentCategory");
        const contentTypeIdx = findIdx("contentType");
        const engRateIdx = findIdx("engRate");
        const engagementsIdx = findIdx("engagements");
        const reachIdx = findIdx("reach");

        for (const row of tableRows) {
            rows.push({
                post: postIdx >= 0 && row[postIdx] != null ? String(row[postIdx]) : "",
                platform: platformIdx >= 0 && row[platformIdx] != null ? String(row[platformIdx]) : "",
                contentCategory: contentCategoryIdx >= 0 && row[contentCategoryIdx] != null ? String(row[contentCategoryIdx]) : "",
                contentType: contentTypeIdx >= 0 && row[contentTypeIdx] != null ? String(row[contentTypeIdx]) : "",
                engRate: engRateIdx >= 0 ? Number(row[engRateIdx]) : 0,
                engagements: engagementsIdx >= 0 ? Number(row[engagementsIdx]) : 0,
                reach: reachIdx >= 0 ? Number(row[reachIdx]) : 0
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
            const ch = this.formattingSettings.columnHeaderCard;
            const sortCard = this.formattingSettings.sortOrderCard;

            this.headerTitle.text(header.title.value);
            this.headerSubtitle.text(header.subtitle.value);
            this.headerIcon.style("display", header.showIcon.value ? "flex" : "none");

            let rows = this.extractData(dataView);

            const sortKey = sortCard.sortBy.value.value as keyof PostRow;
            rows.sort((a, b) => (b[sortKey] as number) - (a[sortKey] as number));
            const topN = sortCard.topN.value;
            if (topN && topN > 0) {
                rows = rows.slice(0, topN);
            }

            this.root.style("--bpp-post-color", dp.postColor.value.value);
            this.root.style("--bpp-post-fontsize", dp.postFontSize.value + "px");
            this.root.style("--bpp-platform-color", dp.platformColor.value.value);
            this.root.style("--bpp-platform-fontsize", dp.platformFontSize.value + "px");
            this.root.style("--bpp-category-color", dp.contentCategoryColor.value.value);
            this.root.style("--bpp-type-color", dp.contentTypeColor.value.value);
            this.root.style("--bpp-content-fontsize", dp.contentFontSize.value + "px");
            this.root.style("--bpp-engrate-color", dp.engRateColor.value.value);
            this.root.style("--bpp-engrate-fontsize", dp.engRateFontSize.value + "px");
            this.root.style("--bpp-engagements-color", dp.engagementsColor.value.value);
            this.root.style("--bpp-engagements-fontsize", dp.engagementsFontSize.value + "px");
            this.root.style("--bpp-reach-color", dp.reachColor.value.value);
            this.root.style("--bpp-reach-fontsize", dp.reachFontSize.value + "px");

            this.root.style("--bpp-header-post-color", ch.postHeaderColor.value.value);
            this.root.style("--bpp-header-post-fontsize", ch.postHeaderFontSize.value + "px");
            this.root.style("--bpp-header-platform-color", ch.platformHeaderColor.value.value);
            this.root.style("--bpp-header-platform-fontsize", ch.platformHeaderFontSize.value + "px");
            this.root.style("--bpp-header-content-color", ch.contentHeaderColor.value.value);
            this.root.style("--bpp-header-content-fontsize", ch.contentHeaderFontSize.value + "px");
            this.root.style("--bpp-header-engrate-color", ch.engRateHeaderColor.value.value);
            this.root.style("--bpp-header-engrate-fontsize", ch.engRateHeaderFontSize.value + "px");
            this.root.style("--bpp-header-engagements-color", ch.engagementsHeaderColor.value.value);
            this.root.style("--bpp-header-engagements-fontsize", ch.engagementsHeaderFontSize.value + "px");
            this.root.style("--bpp-header-reach-color", ch.reachHeaderColor.value.value);
            this.root.style("--bpp-header-reach-fontsize", ch.reachHeaderFontSize.value + "px");

            const rowSel = this.tableBody.selectAll<HTMLDivElement, PostRow>(".bpp-row")
                .data(rows, (d: PostRow) => d.post);

            rowSel.exit().remove();

            const rowEnter = rowSel.enter()
                .append("div")
                .attr("class", "bpp-row");

            rowEnter.append("div").attr("class", "bpp-col bpp-col-post bpp-post-text");

            const platformCol = rowEnter.append("div").attr("class", "bpp-col bpp-col-platform");
            platformCol.append("span").attr("class", "bpp-platform-dot");
            platformCol.append("span").attr("class", "bpp-platform-text");

            const contentCol = rowEnter.append("div").attr("class", "bpp-col bpp-col-content");
            contentCol.append("span").attr("class", "bpp-content-category");
            contentCol.append("span").attr("class", "bpp-content-sep").text(" · ");
            contentCol.append("span").attr("class", "bpp-content-type");

            rowEnter.append("div").attr("class", "bpp-col bpp-col-num bpp-eng-rate");
            rowEnter.append("div").attr("class", "bpp-col bpp-col-num bpp-engagements");
            rowEnter.append("div").attr("class", "bpp-col bpp-col-num bpp-reach");

            const rowMerge = rowEnter.merge(rowSel);

            rowMerge.select(".bpp-post-text").text(d => d.post);
            rowMerge.select(".bpp-platform-dot").style("background-color", d => platformColor(d.platform));
            rowMerge.select(".bpp-platform-text").text(d => d.platform);
            rowMerge.select(".bpp-content-category").text(d => d.contentCategory);
            rowMerge.select(".bpp-content-type").text(d => d.contentType);
            rowMerge.select(".bpp-eng-rate").text(d => formatPct(d.engRate));
            rowMerge.select(".bpp-engagements").text(d => formatK(d.engagements));
            rowMerge.select(".bpp-reach").text(d => formatK(d.reach));

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
