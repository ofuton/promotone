declare namespace promotone.types {
  interface PromotionFields {
    startDatetime: kintone.fieldTypes.DateTime;
    content: kintone.fieldTypes.RichText;
    endDatetime: kintone.fieldTypes.DateTime;

    グループ選択_0: kintone.fieldTypes.GroupSelect;
    グループ選択: kintone.fieldTypes.GroupSelect;
    組織選択: kintone.fieldTypes.OrganizationSelect;
    ユーザー選択: kintone.fieldTypes.UserSelect;
    組織選択_0: kintone.fieldTypes.OrganizationSelect;
    ユーザー選択_0: kintone.fieldTypes.UserSelect;
  }
  interface SavedPromotionFields extends PromotionFields {
    $id: kintone.fieldTypes.Id;
    $revision: kintone.fieldTypes.Revision;
    更新者: kintone.fieldTypes.Modifier;
    作成者: kintone.fieldTypes.Creator;
    レコード番号: kintone.fieldTypes.RecordNumber;
    更新日時: kintone.fieldTypes.UpdatedTime;
    作成日時: kintone.fieldTypes.CreatedTime;
  }
}
