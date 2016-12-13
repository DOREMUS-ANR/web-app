import {Component} from '@angular/core';
import {ExpressionService} from './expression.service';
import {SharedService} from '../../services/sharedService.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare var __moduleName: string;

@Component({
  moduleId: __moduleName,
  templateUrl: 'expression.detail.template.html',
  styleUrls: ['expression.css'],
  providers: [ExpressionService]
})
export class ExpressionDetailComponent {
  sharedService: SharedService;
  expression: any;
  recommendation: [any];
  querying: boolean;
  dates: [any];

  constructor(sharedService: SharedService,
    private expressionService: ExpressionService,
    private route: ActivatedRoute) {

    this.sharedService = sharedService;
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      let id = params['id'];

      if (id) {
        this.querying = true;
        this.expressionService.get(id).then(exp => {
          this.expression = exp;
          console.log(this.expression);
          this.querying = false;

          if (this.expression.creationTime) {
            // prepare dates for timeline
            this.dates = [{
              type: 'creation',
              agent: this.expression.composer,
              date: this.expression.creationTime[0]
            }, {
                type: 'composition',
                date: this.expression.creationTime[0]
              }]
          }
        });
        // retrieve recommendations
        this.expressionService.recommend(id)
          .then((res) => this.recommendation = res);

        // FIXME discover why this is not propagated to sharedService
        this.sharedService.sharchBarVisible = false;
      }
    });
  }

  isNode(a) {
    return a.startsWith('node');
  }

}
