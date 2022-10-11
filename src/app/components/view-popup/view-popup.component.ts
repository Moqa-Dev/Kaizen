import {Component, Inject} from '@angular/core';
import {MatDialogModule, MAT_DIALOG_DATA} from "@angular/material/dialog";
import Utils from "../../util/Utils";
import {TreeNode} from "../../models/tree-node";
import { MatDividerModule } from '@angular/material/divider';

declare const $: any;

@Component({
  selector: 'app-view-popup',
  templateUrl: './view-popup.component.html',
  styleUrls: ['./view-popup.component.scss'],
  standalone: true,
  imports:[
    MatDialogModule,
    MatDividerModule,
  ]
})
export class ViewPopupComponent {

  elementsNames: string[] = [];
  elementsNamesToDisplay: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {

    this.elementsNames = Object.keys(this.data);
    for (let i = 0; i < this.elementsNames.length; i++) {
      this.elementsNamesToDisplay.push(Utils.toPascalCase(Utils.separateWords(this.elementsNames[i])));
    }
  }

  isTreeNode(node: any, index: number): boolean {
    if (node instanceof Array && node.length > 0) {
      if (node[0] instanceof TreeNode) {
        $('#tree' + index).bstreeview({
          data: node,
          expandIcon: 'fa fa-angle-down fa-fw',
          collapseIcon: 'fa fa-angle-right fa-fw',
          indent: 1.25,
          parentsMarginLeft: '0',
          openNodeLinkOnNewTab: true
        });
        return true;
      }
    }
    return false;
  }

  isEmptyTreeNode(node: any, index: number): boolean {
    if (node instanceof Array && node.length > 0) {
      if (node[0] instanceof TreeNode) {
        if (node[0].nodes.length == 0)
          return true;
      }
    }
    return false;
  }
}
