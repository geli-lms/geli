import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, Injectable, Input} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
import {ICourse} from '../../../../../../../../shared/models/ICourse';
import {DataSharingService} from '../../../../shared/services/data-sharing.service';
import {IFileUnit} from '../../../../../../../../shared/models/units/IFileUnit';
import {IUnit} from '../../../../../../../../shared/models/units/IUnit';

export class DLNode {
  children: DLNode[];
  item: string;
  id: any;
}

export class DLFlatNode {
  item: string;
  level: number;
  id: any;
  expandable: boolean;
}

@Component({
  selector: 'app-download-tree',
  templateUrl: './download-tree.component.html',
  styleUrls: ['./download-tree.component.scss']
})
export class DownloadTreeComponent {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<DLFlatNode, DLNode>();
  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<DLNode, DLFlatNode>();
  /** A selected parent node to be inserted */
    // selectedParent: DLFlatNode | null = null;
  treeControl: FlatTreeControl<DLFlatNode>;
  treeFlattener: MatTreeFlattener<DLNode, DLFlatNode>;
  dataSource: MatTreeFlatDataSource<DLNode, DLFlatNode>;
  /** The selection for checklist */
  checklistSelection = new SelectionModel<DLFlatNode>(true /* multiple */);

  @Input() course: ICourse;

  constructor(private dataSharingService: DataSharingService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<DLFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.course = this.dataSharingService.getDataForKey('course');
    this.dataSource.data = this.buildFileTree(this.preBuildJSON(), 0);
  }

  getLevel = (node: DLFlatNode) => node.level;
  isExpandable = (node: DLFlatNode) => node.expandable;
  getChildren = (node: DLNode): Observable<DLNode[]> => observableOf(node.children);
  hasChild = (_: number, _nodeData: DLFlatNode) => _nodeData.expandable;
  // hasNoContent = (_: number, _nodeData: DLFlatNode) => _nodeData.item === '';

  /**Transformer to convert nested node to flat node. Record the nodes in maps for later use.*/
  transformer = (node: DLNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new DLFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: DLFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: DLFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the download item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: DLFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  preBuildJSON(): object {
    let copyCourse: any = {};
    const key = this.course.name;
    copyCourse[key] = {};
    this.course.lectures.forEach((lec) => {
      const lk = lec.name;
      copyCourse[key][lk] = [];
      lec.units.forEach((unit) => {
        if (unit.__t === 'file') {
          const uk = unit.name;
          const fUnit: IFileUnit = unit as IFileUnit;
          const fUnitObj = {};
          fUnitObj[uk] = [];
          fUnit.files.forEach((fu) => {
            const fk = fu.name;
            fUnitObj[uk].push(fk);
          });
          copyCourse[key][lk].push(fUnitObj);
        } else {
          const uk = unit.name;
          copyCourse[key][lk].push(uk);
        }
      });
    });
    console.dir(copyCourse);
    return copyCourse;
  }

// var key = "happyCount";
//   var obj = {};
//   obj[key] = someValueArray;
//   myArray.push(obj);
//
//
// {
//   Applications: {
//     Calendar: 'app',
//     Chrome: 'app',
//     Webstorm: 'app'
//   },
//   Documents: {
//     angular: {
//       src: {
//         compiler: 'ts',
//         core: 'ts'
//       }
//     },
//     material2: {
//       src: {
//         button: 'ts',
//         checkbox: 'ts',
//         input: 'ts'
//       }
//     }
//   },
//   Downloads: {
//     October: 'pdf',
//     November: 'pdf',
//     Tutorial: 'html'
//   },
//   Pictures: {
//     'Photo Booth Library': {
//       Contents: 'dir',
//       Pictures: 'dir'
//     },
//     Sun: 'png',
//     Woods: 'jpg'
//   }
// }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `DLNode`.
   * TODO: Adapt
   */
  buildFileTree(obj: object, level: number): DLNode[] {
    return Object.keys(obj).reduce<DLNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new DLNode();
      node.item = key;
      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }
      return accumulator.concat(node);
    }, []);
  }
}
