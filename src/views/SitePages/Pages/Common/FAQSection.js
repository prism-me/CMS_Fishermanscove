import React, { Fragment, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MaterialButton from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";
import CKEditor from "ckeditor4-react";
import { ckEditorConfig } from "utils/data";
import Typography from "@material-ui/core/Typography";

export default function FAQSection(props) {
  return (

      props.section_content?.length > 0 &&
      props.section_content?.map((x, i) => (
      <div
        className="mb-3 p-2"
        style={{ boxShadow: "0 0 4px #dadada", position: "relative" }}
      >
        <MaterialButton
          onClick={() => props.removeQuestion(x.id)}
          titleAccess="Remove Question"
          variant="outlined"
          size="small"
          color="secondary"
          style={{
            position: "absolute",
            right: "-10px",
            top: "-10px",
            cursor: "pointer",
          }}
        >
          Remove
        </MaterialButton>

        <Typography className="mb-2 font-weight-bold" variant="body2">
          Question# {i + 1}
        </Typography>
        <TextField
          required
          id={`question_${i}`}
          name={`question_${i}`}
          label="Section Title"
          value={x.question}
          variant="outlined"
          fullWidth
          onChange={(e) => props.handleQuestionChange(e, "faq", i)}
          size="small"
          style={{ marginBottom: "1rem" }}
        />
        {/* CKEDITOR  */}
        <CKEditor
            config={ckEditorConfig}
            onBeforeLoad={(CKEDITOR) => (CKEDITOR.disableAutoInline = true)}
            data={x.answer}
          onChange={(e) =>
            props.handleAnswerChange(e.editor.getData(), "faq", i)
          }
        />
      </div>
    ))
  );
}
