export enum ExamTypes {
    Normal,
    Test,
}

export enum AnswerKeyTypes {
    A,
    B,
    C,
    D,
}
type TExamTypes =
    ExamTypes.Normal |
    ExamTypes.Test;
type TAnswerKeyTypes = AnswerKeyTypes.A | AnswerKeyTypes.B | AnswerKeyTypes.C | AnswerKeyTypes.D;

export interface IExam {
    id?: string;
    urlContent: string;
    urlExplain: string;
    answerKeys: TAnswerKeyTypes[];
    type: TExamTypes;
}

export class  Exam implements IExam {
    public id?: string;
    public urlContent: string;
    public urlExplain: string;
    public answerKeys: TAnswerKeyTypes[];
    public type: TExamTypes;


    constructor(urlContent: string,
                urlExplain: string,
                answerKeys: TAnswerKeyTypes[],
                type: TExamTypes) {
        this.urlContent = urlContent;
        this.answerKeys = answerKeys;
        this.urlExplain = urlExplain;
        this.type = type;
    }

}
