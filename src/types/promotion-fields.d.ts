declare namespace promotone.types {
  interface PromotionFields {
    content: kintone.fieldTypes.RichText
  }
  interface SavedPromotionFields extends PromotionFields {
    $id: kintone.fieldTypes.Id
    $revision: kintone.fieldTypes.Revision
    更新者: kintone.fieldTypes.Modifier
    作成者: kintone.fieldTypes.Creator
    レコード番号: kintone.fieldTypes.RecordNumber
    更新日時: kintone.fieldTypes.UpdatedTime
    作成日時: kintone.fieldTypes.CreatedTime
  }
}
