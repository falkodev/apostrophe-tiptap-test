<template>
  <div class="apostrophe-tiptap-file-upload-control">
    <button @click="click()" class="apos-tiptap-menubar__button" :class="{ 'apos-tiptap-menubar__button--active': active() }">
      <FileUpload :title="tool.label" :size="18" />
    </button>
    <ApostropheModal v-if="editing">
      <template slot="body">
        <div class="apos-window-form">
          <form v-if="editing">
            <fieldset class="apos-window-fieldset">
              <label class="apos-window-label" for="file">Upload CSV or Excel file</label>
              <input class="apos-window-input" type="file" name="file" accept=".xls, .xlsx, .csv" @change="onFilePicked"/>
            </fieldset>
          </form>
          <table>
            <tr class="apos-modal-preview" v-for="(row, index) in preview" :key="index">
              <td class="apos-modal-preview__cell" v-for="(cell, i) in row" :key="i">
                {{ cell }}
              </td>
            </tr>
          </table>
        </div>
      </template>
      <template slot="footer">
        <slot name="footer">
          <button class="apos-window-button" @click="close">
            Cancel
          </button>
          <button class="apos-window-button apos-window-button--primary" @click="save()">
            Save
          </button>
        </slot>
      </template>
    </ApostropheModal>
  </div>
</template>

<script>
import XLSX from 'xlsx';
import FileUpload from 'vue-material-design-icons/FileUpload.vue';
import ApostropheModal from 'apostrophe-tiptap-rich-text-widgets/src/apos/components/ApostropheModal.vue';

export default {
  name: 'ApostropheTiptapImportData',
  components: { FileUpload, ApostropheModal },
  props: {
    name: String,
    tool: Object,
    editor: Object
  },
  data () {
    return {
      preview: [],
      editing: false
    };
  },
  methods: {
    click() {
      this.editing = !this.editing;
    },
    close() {
      this.editing = false;
      this.preview = [];
      this.editor.focus();
    },
    save() {
      // this.editor.commands.createTable({ rowsCount: 1, colsCount: 1, withHeaderRow: false });
      // let transaction = this.editor.state.tr.insertText(this.preview[0][0])
      // this.editor.view.dispatch(transaction)
      const table = document.querySelector('table')
      this.editor.setContent(table.outerHTML)
      this.editing = false;
    },
    active() {
      return this.editor.isActive.link();
    },
    onFilePicked(file) {
      const reader = new FileReader();
      reader.readAsBinaryString(file.target.files[0]);
      reader.onload = () => {
        const wb = XLSX.read(reader.result, { type:'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        this.preview = XLSX.utils.sheet_to_json(ws, { header:1 });
      }
    }
  }
};
</script>

<style type="text/css">
  table {
    table-layout: fixed ;
    width: 100% ;
    border: 1px solid #DBDBDB;
  }
  td {
    width: 25% ;
  }
  .apostrophe-tiptap-file-upload-control {
    display: inline-block;
  }
  .apos-window-form {
    color: #323232;
    height: 400px;
    overflow: auto;
  }
  .apos-modal-preview {
    display: flex;
  }
  .apos-modal-preview__cell {
    padding: 10px;
    border: 1px solid #DBDBDB;
  }
</style>
